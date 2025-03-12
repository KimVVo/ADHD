import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/axiosInstance"; // Adjust the import path as needed
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput"; // Adjust the import path as needed

const AddEditTasks = ({
  noteData,
  type,
  getAllTasks,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [dueDate, setDueDate] = useState(
    noteData?.dueDate ? new Date(noteData.dueDate) : null
  );
  // const [reminderTime, setReminderTime] = useState(
  //   noteData?.reminderTime ? new Date(noteData.reminderTime) : null
  // );

  const [error, setError] = useState(null);

  // Function to schedule browser notification
  const scheduleNotification = (task) => {
    const reminderTime = new Date(task.reminderTime);
    if (isNaN(reminderTime)) {
      console.error(`Invalid reminder time for task: ${task.title}`);
      return;
    }

    // const delay = reminderTime - Date.now();
    console.log(`Task: ${task.title}`);
  };

  // Add Task
  const addNewTask = async () => {
    try {
      const response = await axiosInstance.post("/add-task", {
        title: title,
        content: content,
        tags: tags,
        dueDate: dueDate,
        //  reminderTime: reminderTime,
      });

      if (response.data && response.data.task) {
        showToastMessage("Task added successfully");
        getAllTasks();
        onClose();
        scheduleNotification(response.data.task); // Schedule notification for the new task
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

  // Edit Task
  const editTask = async () => {
    try {
      const response = await axiosInstance.put(`/edit-task/${noteData._id}`, {
        title: title,
        content: content,
        tags: tags,
        dueDate: dueDate,
        //  reminderTime: reminderTime,
      });

      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
        onClose();
        scheduleNotification(response.data.task); // Schedule notification for the updated task
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

  const handleAddTask = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }

    setError("");

    if (type === "edit") {
      editTask();
    } else {
      addNewTask();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleAddTask();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [title, content, tags, dueDate]);

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-300"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to Gym at 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT (Optional)</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      <div className="mt-3">
        <label className="input-label">DUE DATE</label>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          showTimeSelect
          timeIntervals={1}
          dateFormat="Pp"
          className="ml-2 text-sm text-slate-950 outline bg-slate-100 p-2 rounded"
        />
      </div>
      {/* <div className="mt-3">
        <label className="input-label">REMINDER TIME</label>
        <DatePicker
          selected={reminderTime}
          onChange={(date) => setReminderTime(date)}
          showTimeSelect
          timeCaption="Time"
          dateFormat="Pp"
          className="ml-2 text-sm text-slate-950 outline bg-slate-100 p-2 rounded"
        />
      </div> */}

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-media mt-5 p-3"
        onClick={handleAddTask}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>

      <ToastContainer />
    </div>
  );
};

AddEditTasks.propTypes = {
  noteData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    dueDate: PropTypes.string,
    reminderTime: PropTypes.string,
  }),
  type: PropTypes.string.isRequired,
  getAllTasks: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showToastMessage: PropTypes.func.isRequired,
};

export default AddEditTasks;
