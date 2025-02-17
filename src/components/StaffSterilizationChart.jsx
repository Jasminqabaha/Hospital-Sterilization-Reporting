import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "../firebase"; 
import "chart.js/auto";

const prepareChartData = (staffData) => {
  const monthMap = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  const monthCounts = {};
  Object.values(monthMap).forEach((month) => (monthCounts[month] = 0));

  staffData.forEach((staff) => {
    if (staff.sterilized === "Yes" && staff.date) {
      const month = monthMap[staff.date.split("-")[1]]; 
      if (month) {
        monthCounts[month] += 1;
      }
    }
  });

  return {
    labels: Object.keys(monthCounts),
    datasets: [
      {
        label: "Number of People Committed to Sterilization",
        data: Object.values(monthCounts),
        borderColor: "#00BFFF",
        backgroundColor: "rgba(0, 191, 255, 0.2)",
        pointBackgroundColor: "#00BFFF",
        pointBorderColor: "#00BFFF",
        tension: 0.3,
      },
    ],
  };
};

export default function StaffSterilizationChart() {
  const [staffData, setStaffData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const staffRef = ref(realtimeDb, "/"); 
    const unsubscribe = onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.entries(data).map(([id, details]) => ({
          id,
          staffID: details.fingerprint_id || "",
          name: details.name || "",
          date: details.date || "",
          time: details.time || "",
          sterilized: details.status || "",
        }));
        setStaffData(formattedData);

        const updatedChartData = prepareChartData(formattedData);
        setChartData(updatedChartData);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of People" },
        ticks: { stepSize: 1 },
      },
      x: {
        title: { display: true, text: "Month" },
      },
    },
    plugins: {
      legend: { display: true, position: "top" },
    },
  };

  return (
    <div className="w-full h-96 p-4">
      <h2 className="text-center text-xl font-bold mb-4">
        Commitment to Sterilization Over Time
      </h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
