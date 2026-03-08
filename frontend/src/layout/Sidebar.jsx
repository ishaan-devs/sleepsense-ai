import { useState } from "react";
import { useApp } from "../context/AppContext";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import { analyzeSleep } from "../services/api";

const Sidebar = () => {
  const { dispatch } = useApp();

  const [formData, setFormData] = useState({
    sleepHours: 7,
    bedtime: "",
    screenUsage: false,
    stressLevel: 3,
    activityLevel: "Moderate",
    mood: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const calculateSleepStatus = (data) => {
    if (data.sleepHours < 6) return "Poor";
    if (data.sleepHours >= 6 && data.sleepHours < 7) return "Irregular";
    return "Healthy";
  };

  const handleSubmit = async () => {

    if (!formData.bedtime) {
      toast.error("Please enter bedtime");
      return;
    }

    try {

      const payload = {
        sleep_hours: formData.sleepHours,
        stress_level: formData.stressLevel,
        screen_usage: formData.screenUsage,
        activity_level: formData.activityLevel,
        mood: formData.mood
      };

      const response = await analyzeSleep(payload);

      const result = response.data;

      toast.success("Sleep analysis completed");

      dispatch({
        type: "SET_SLEEP_STATUS",
        payload: result.sleep_status
      });

      dispatch({
        type: "ADD_CHAT_MESSAGE",
        payload: {
          role: "assistant",
          content: `Sleep Status: ${result.sleep_status}. Recommendations: ${result.recommendations.join(", ")}`,
          timestamp: new Date()
        }
      });

    } catch (error) {

      console.error(error);
      toast.error("Failed to analyze sleep");

    }

  };

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-lg font-semibold">Today's Sleep Log</h2>

      {/* Sleep Hours */}
      <div>
        <label className="text-sm font-medium">
          Hours Slept: {formData.sleepHours}
        </label>
        <input
          type="range"
          min="0"
          max="12"
          step="0.5"
          name="sleepHours"
          value={formData.sleepHours}
          onChange={handleChange}
          className="w-full mt-2"
        />
      </div>

      {/* Bedtime */}
      <div>
        <label className="text-sm font-medium">Bedtime</label>
        <input
          type="time"
          name="bedtime"
          value={formData.bedtime}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg p-2"
        />
      </div>

      {/* Screen Usage */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="screenUsage"
          checked={formData.screenUsage}
          onChange={handleChange}
        />
        <label className="text-sm">Used screen before sleep</label>
      </div>

      {/* Stress Level */}
      <div>
        <label className="text-sm font-medium">
          Stress Level: {formData.stressLevel}
        </label>
        <input
          type="range"
          min="1"
          max="5"
          name="stressLevel"
          value={formData.stressLevel}
          onChange={handleChange}
          className="w-full mt-2"
        />
      </div>

      {/* Activity Level */}
      <div>
        <label className="text-sm font-medium">Activity Level</label>
        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg p-2"
        >
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>
      </div>

      {/* Mood */}
      <div>
        <label className="text-sm font-medium">Morning Mood</label>
        <textarea
          name="mood"
          value={formData.mood}
          onChange={handleChange}
          placeholder="Describe how you feel..."
          className="w-full mt-2 border rounded-lg p-2"
        />
      </div>

      <Button className="w-full" onClick={handleSubmit} >
        Analyze My Sleep
      </Button>
    </div>
  );
};

export default Sidebar;