import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { exportSleepDataCSV } from "../../utils/exportCSV";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const InsightsPanel = () => {

  const { state, dispatch } = useApp();
  const { sleepEntries, sleepStatus, refetchCounter } = state;

  const [aiInsights, setAiInsights] = useState([]);

  const fetchAllData = async () => {
    try {
      // Fetch sleep data
      const sleepResponse = await fetch("http://127.0.0.1:8000/sleep-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const sleepData = await sleepResponse.json();
      if (sleepData.entries) {
        dispatch({
          type: "SET_SLEEP_ENTRIES",
          payload: sleepData.entries
        });
      }

      // Fetch AI insights
      const insightsResponse = await fetch("http://127.0.0.1:8000/insights", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const insightsData = await insightsResponse.json();
      if (insightsData.insights) {
        setAiInsights(insightsData.insights);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  // Fetch data on mount and when refetch is signaled
  useEffect(() => {
    fetchAllData();
  }, [refetchCounter]);

  const handleExport = () => {
    exportSleepDataCSV(sleepEntries);
  };

  // ---------------------------------------------------
  // Empty state
  // ---------------------------------------------------
  if (!sleepEntries || sleepEntries.length === 0) {

    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Insights</h2>

        <Card className="text-center text-gray-500 p-6">
          <p>No sleep data yet 🌙</p>
          <p className="text-sm mt-2">
            Tell the AI how many hours you slept (example: "I slept 5 hours today")
            and insights will appear here.
          </p>
        </Card>
      </div>
    );

  }

  // ---------------------------------------------------
  // Chart data
  // ---------------------------------------------------
  const labels = sleepEntries.map((_, i) => `Day ${i + 1}`);

  const sleepData = sleepEntries.map((entry) => entry.sleepHours);

  const stressData = sleepEntries.map((entry) => entry.stressLevel);

  const sleepChartData = {
    labels,
    datasets: [
      {
        label: "Sleep Hours",
        data: sleepData,
        borderColor: "#3AB0A2",
        backgroundColor: "rgba(58,176,162,0.2)",
        tension: 0.4
      }
    ]
  };

  const stressChartData = {
    labels,
    datasets: [
      {
        label: "Stress Level",
        data: stressData,
        borderColor: "#E57373",
        backgroundColor: "rgba(229,115,115,0.2)",
        tension: 0.4
      }
    ]
  };

  const handleReset = () => {

    localStorage.removeItem("sleepAppState");
    window.location.reload();

  };

  const averageSleep =
    sleepData.reduce((a, b) => a + b, 0) / sleepData.length;

  const getStatusColor = () => {

    if (sleepStatus === "Healthy") return "green";
    if (sleepStatus === "Irregular") return "yellow";
    if (sleepStatus === "Poor") return "red";

    return "gray";

  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">

      <h2 className="text-lg font-semibold">Insights</h2>

      {/* Sleep Status */}
      <Card>
        <p className="text-sm text-gray-500">Sleep Status</p>
        <div className="mt-2">
          <Badge color={getStatusColor()}>
            {sleepStatus || "Unknown"}
          </Badge>
        </div>
      </Card>

      {/* Average Sleep */}
      <Card>
        <p className="text-sm text-gray-500">Average Sleep</p>
        <p className="text-2xl font-semibold mt-2">
          {averageSleep.toFixed(1)} hrs
        </p>
      </Card>

      {/* Sleep Chart */}
      <Card>
        <Line data={sleepChartData} />
      </Card>

      {/* Stress Chart */}
      <Card>
        <Line data={stressChartData} />
      </Card>

      {/* AI Insights */}
      <Card>

        <p className="text-sm text-gray-500 mb-3">AI Sleep Insights</p>

        {aiInsights.length === 0 ? (

          <p className="text-gray-500 text-sm">
            AI insights will appear after analyzing your sleep data.
          </p>

        ) : (

          <ul className="space-y-2 list-disc pl-5">

            {aiInsights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-700">
                {insight}
              </li>
            ))}

          </ul>

        )}

      </Card>

      {/* Buttons */}
      <Button
        variant="danger"
        className="w-full"
        onClick={handleReset}
      >
        Reset All Data
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={handleExport}
      >
        Export Sleep Data (CSV)
      </Button>

    </div>
  );

};

export default InsightsPanel;