import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { realtimeDb } from "../firebase";

export default function StaffTable() {
  const [staffData, setStaffData] = useState([]);
  const [filters, setFilters] = useState({
    searchId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [nameMapping, setNameMapping] = useState({}); 

  useEffect(() => {
    const staffRef = ref(realtimeDb, "/"); 
    onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.entries(data).map(([id, details]) => {
          const existingName = nameMapping[details.fingerprint_id];
          return {
            id, 
            staffID: details.fingerprint_id,
            name: existingName || details.name || "", 
            date: details.date || "", 
            time: details.time || "", 
            sterilized: details.status, 
          };
        });
  
       
        const updatedNameMapping = { ...nameMapping };
        formattedData.forEach((staff) => {
          if (staff.name) {
            updatedNameMapping[staff.staffID] = staff.name;
          }
        });
  
        
        const updates = {};
        formattedData.forEach((staff) => {
          if (!staff.name && updatedNameMapping[staff.staffID]) {
            const nameToAssign = updatedNameMapping[staff.staffID];
            staff.name = nameToAssign; 
            updates[`/${staff.id}/name`] = nameToAssign; 
          }
        });
  
        if (Object.keys(updates).length > 0) {
          update(ref(realtimeDb), updates).catch((error) => {
            console.error("Error updating names in Firebase:", error);
          });
        }
  
        setNameMapping(updatedNameMapping);
        setStaffData(formattedData.reverse());
      }
    });
  }, [nameMapping]);
  

  const handleNameChange = (staffID, newName) => {
   
    setStaffData((prevData) =>
      prevData.map((staff) =>
        staff.staffID === staffID ? { ...staff, name: newName } : staff
      )
    );

    setNameMapping((prevMapping) => ({
      ...prevMapping,
      [staffID]: newName,
    }));
  };

  const saveNameToFirebase = (staffID, name) => {
  
    const affectedRows = staffData.filter((staff) => staff.staffID === staffID);

    const updates = {};
    affectedRows.forEach((staff) => {
      updates[`/${staff.id}/name`] = name;
    });

    update(ref(realtimeDb), updates).catch((error) => {
      console.error("Error updating name in Firebase:", error);
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredData = staffData.filter((staff) => {
    const { searchId, startDate, startTime, endDate, endTime } = filters;

    const staffDateTime = new Date(`${staff.date}T${staff.time}`);
    const startDateTime =
      startDate && startTime ? new Date(`${startDate}T${startTime}`) : null;
    const endDateTime =
      endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    return (
      (!searchId || staff.staffID.toString().includes(searchId)) &&
      (!startDateTime || staffDateTime >= startDateTime) &&
      (!endDateTime || staffDateTime <= endDateTime)
    );
  });

  return (
    <div className="overflow-x-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Sterilization Report</h1>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          name="searchId"
          value={filters.searchId}
          onChange={handleFilterChange}
          placeholder="Search Staff ID"
          className="border rounded p-2 w-40"
        />
        <div className="flex items-center gap-2">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={filters.startTime}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            value={filters.endTime}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() =>
            setFilters({
              searchId: "",
              startDate: "",
              startTime: "",
              endDate: "",
              endTime: "",
            })
          }
        >
          Reset Filters
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-4 py-2">Staff ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
            <th className="border border-gray-300 px-4 py-2">Sterilized</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((staff) => (
            <tr key={staff.id} className="even:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 text-center">
                {staff.staffID}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {editingId === staff.id ? (
                  <input
                    type="text"
                    value={staff.name}
                    onChange={(e) =>
                      handleNameChange(staff.staffID, e.target.value)
                    }
                    onBlur={(e) => {
                      saveNameToFirebase(staff.staffID, e.target.value);
                      setEditingId(null);
                    }}
                    placeholder="Set Name"
                    className="border rounded p-2 w-full"
                  />
                ) : (
                  <span
                    onDoubleClick={() => setEditingId(staff.id)}
                    className="cursor-pointer"
                  >
                    {staff.name || "(No Name)"}
                  </span>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {staff.date}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {staff.time}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {staff.sterilized}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => saveNameToFirebase(staff.staffID, staff.name)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
