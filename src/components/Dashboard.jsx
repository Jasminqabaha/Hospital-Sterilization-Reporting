import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Header from "../components/Header";
import StaffSterilizationChart from "../components/StaffSterilizationChart";
import StaffTable from "../components/StaffTable";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password"); // Redirect to the change password page
  };

  return (
    <div>
      <Header />
      <div className="flex justify-end gap-4 p-4">
        <button
          onClick={handleChangePassword}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Change Password
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <StaffSterilizationChart  />
      <StaffTable />
    </div>
  );
}
