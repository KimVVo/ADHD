import { useState } from "react";
import PropTypes from "prop-types";
import { MdClose } from "react-icons/md";

import axiosInstance from "../../utils/axiosInstance";
const AddEditHabits = ({
  habitData,
  type,
  getAllHabits,
  onClose,
  showToastMessage,
}) => {
  const [name, setName] = useState(habitData?.name || "");
  const [goal, setGoal] = useState(habitData?.goal || "");
  const [repeat, setRepeat] = useState(habitData?.repeat || "daily");
  const [color, setColor] = useState(habitData?.color || "#000000");
  const [notify, setNotify] = useState(habitData?.notify || "");

  const [error, setError] = useState(null);

  // Add Habit
  const addNewHabit = async () => {
    try {
      const response = await axiosInstance.post("/add-habit", {
        name,
        goal,
        repeat,
        color,
        notify,
      });
      if (response.data && response.data.habit) {
        getAllHabits();
        showToastMessage("Habit added successfully!");
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };
  AddEditHabits.propTypes = {
    habitData: PropTypes.object,
    type: PropTypes.string.isRequired,
    getAllHabits: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    showToastMessage: PropTypes.func.isRequired,
  };

  // Edit Habit
  const editHabit = async () => {
    const habitId = habitData._id;
    try {
      const response = await axiosInstance.put("/edit-habit/" + habitId, {
        name,
        goal,
        repeat,
        color,
        notify,
      });
      if (response.data && response.data.habit) {
        getAllHabits();
        showToastMessage("Habit updated successfully!");
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddHabit = () => {
    if (!name) {
      setError("Please enter a habit name");
      return;
    }
    if (!goal) {
      setError("Please enter a goal");
      return;
    }
    if (!notify) {
      setError("Please select a notification time");
      return;
    }

    setError("");

    if (type === "edit") {
      editHabit();
    } else {
      addNewHabit();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-7 -right-3 hover:bg-slate-300"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2 mt-5">
        <label className="input-label">Name</label>
        <input
          type="text"
          placeholder="Enter habit name"
          className="input-box"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label className="block text-sm font-medium text-gray-700">Goal</label>
        <input
          type="number"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label className="block text-sm font-medium text-gray-700">
          Repeat
        </label>
        <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekends">Weekends</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
          <option value="every 3 months">Every 3 months</option>
          <option value="every 6 months">Every 6 months</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="flex flex-col my-4">
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="color"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label className="block text-sm font-medium text-gray-700">
          Notify
        </label>
        <input
          type="time"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={notify}
          onChange={(e) => setNotify(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        onClick={handleAddHabit}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};
AddEditHabits.propTypes = {
  habitData: PropTypes.object,
  type: PropTypes.string.isRequired,
  getAllHabits: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddEditHabits;
