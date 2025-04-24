import { useEffect, useState } from "react";
import CalendarApp from "../../components/Calendar/Calendar";
import Nav from "../../components/Navbar/Nav";
import UniversalNavbar from "../../components/Navbar/UniversalNavbar";
import NoteCard from "../../components/Cards/NoteCard";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "react-modal";
import { MdAdd, MdCheck } from "react-icons/md";
import AddEditTasks from "../Home/AddEditTasks";
import Toast from "../../components/ToastMessage/Toast";
import Habits from "../../components/Habits/Habits";
import AddEditHabits from "../../components/Habits/AddEditHabits";
import Tooltip from "../../components/Tooltip/Tooltip";

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [allHabits, setAllHabits] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: "add",
    message: "",
  });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openAddEditHabitModal, setOpenAddEditHabitModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const handleEdit = (task) => {
    setOpenAddEditModal({ isShown: true, data: task, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const deleteTask = async (task) => {
    try {
      const response = await axiosInstance.delete(`/delete-task/${task._id}`);
      if (response.data && !response.data.error) {
        showToastMessage("Task Deleted Successfully", "delete");
        getAllTasks();
      }
    } catch {
      console.error("An unexpected error occurred. Please try again.");
    }
  };

  const updateIsCompleted = async (task) => {
    try {
      const response = await axiosInstance.put(
        `/update-task-completed/${task._id}`,
        {
          isCompleted: !task.isCompleted,
        }
      );
      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateIsPinned = async (task) => {
    try {
      const response = await axiosInstance.put(
        `/update-task-pinned/${task._id}`,
        {
          isPinned: !task.isPinned,
        }
      );
      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/get-all-tasks");
      if (response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const getAllHabits = async () => {
    try {
      const response = await axiosInstance.get("/get-all-habits");
      if (response.data && response.data.habits) {
        setAllHabits(response.data.habits);
      }
    } catch {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  const handleEditHabit = (habitDetails) => {
    setOpenAddEditHabitModal({
      isShown: true,
      data: habitDetails,
      type: "edit",
    });
  };

  const deleteHabit = async (data) => {
    const habitId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-habit/" + habitId);
      if (response.data && !response.data.error) {
        getAllHabits();
        showToastMessage("Habit Deleted Successfully!", "delete");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleUpdateProgress = async (habit) => {
    if (habit.progress >= habit.goal) {
      showToastMessage("Progress cannot exceed the goal!", "error");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/update-habit-progress/${habit._id}`,
        {
          progress: habit.progress + 1,
        }
      );

      if (response.data && response.data.habit) {
        showToastMessage("Progress updated successfully!", "success");
        getAllHabits();
      }
    } catch (error) {
      console.error("Error updating progress:", error.message);
      showToastMessage("Failed to update progress. Please try again.", "error");
    }
  };

  useEffect(() => {
    getAllTasks();
    getAllHabits();
    getUserInfo();
  }, []);

  const incompleteTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  return (
    
  <div className="relative h-screen font-montserrat">
      <UniversalNavbar userInfo={userInfo} pageTitle="Calendar" className="tracking-wide" />
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-20">
          <Nav />
        </div>
        {/* Main content container: Calendar + Task Sections */}
        <div className="flex flex-col lg:flex-row flex-1 ml-20">
          {/* Calendar Section */}
          <div className="lg:flex-1 pt-20 pl-4 pr-4">
            <CalendarApp tasks={tasks} habits={allHabits} />
          </div>
          {/* Task + Habits Section */}
          <div className="lg:w-1/4 w-full flex flex-col pt-6 lg:pt-20 px-4">
            {/* Add Task Section */}
            <div className="pb-10">
              <div className="flex items-center justify-between">
                <h1>Add Task</h1>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: "add", data: null });
                  }}
                >
                  <MdAdd className="text-white text-[24px]" />
                </button>
              </div>
            </div>

            {/* Incomplete Tasks Section */}
            <div className="pb-10">
              <h1>Task List</h1>
              {incompleteTasks.length > 0 ? (
                <ul>
                  {incompleteTasks.map((task) => (
                    <NoteCard
                      key={task._id}
                      title={task.title}
                      content={task.content}
                      tags={task.tags}
                      dueDate={task.dueDate}
                      reminderTime={task.reminderTime}
                      isPinned={task.isPinned}
                      isCompleted={task.isCompleted}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => deleteTask(task)}
                      onPinNote={() => updateIsPinned(task)}
                      onToggleComplete={() => updateIsCompleted(task)}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">Task list is empty</p>
              )}
            </div>

            {/* Completed Tasks Section */}
            <div className="pb-10">
              <h1>Completed Tasks</h1>
              {completedTasks.length > 0 ? (
                <ul>
                  {completedTasks.map((task) => (
                    <NoteCard
                      key={task._id}
                      title={task.title}
                      content={task.content}
                      tags={task.tags}
                      dueDate={task.dueDate}
                      reminderTime={task.reminderTime}
                      isPinned={task.isPinned}
                      isCompleted={task.isCompleted}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => deleteTask(task)}
                      onToggleComplete={() => updateIsCompleted(task)}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">Completed task list is empty</p>
              )}
            </div>

            {/* Habits Section */}
            <div className="pb-10">
              <div className="flex items-center justify-between mb-4">
                <h1>Your Habits</h1>
                <div className="relative group">
                  <button
                    onClick={() => {
                      setOpenAddEditHabitModal({
                        isShown: true,
                        type: "add",
                        data: null,
                      });
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600"
                  >
                    <MdAdd className="text-white text-[24px]" />
                  </button>
                  <Tooltip text="Add Habit" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {allHabits.length > 0 ? (
                  allHabits.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
                    >
                      <Habits
                        name={item.name}
                        repeat={item.repeat}
                        progress={item.progress}
                        goal={item.goal}
                        color={item.color}
                        notify={item.notify}
                        onEditHabit={() => handleEditHabit(item)}
                        onDeleteHabit={() => deleteHabit(item)}
                      />
                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <button
                            onClick={() => handleUpdateProgress(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600"
                          >
                            <MdCheck className="text-white text-[20px]" />
                          </button>
                          <Tooltip text="Update Progress" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {item.progress}/{item.goal}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 mt-2">No habits created yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Task Modal */}
          <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={() => {
              setOpenAddEditModal({ isShown: false, type: "add", data: null });
            }}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.2)",
                zIndex: 1000,
              },
              content: {
                zIndex: 1001,
              },
            }}
            contentLabel=""
            className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-16 p-5 overflow-scroll"
          >
            <AddEditTasks
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              onClose={() => {
                setOpenAddEditModal({ isShown: false, type: "add", data: null });
              }}
              getAllTasks={getAllTasks}
              showToastMessage={showToastMessage}
            />
          </Modal>

          {/* Habit Modal */}
          <Modal
            isOpen={openAddEditHabitModal.isShown}
            onRequestClose={() => {
              setOpenAddEditHabitModal({
                isShown: false,
                type: "add",
                data: null,
              });
            }}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.2)",
                zIndex: 1000,
              },
              content: {
                zIndex: 1001,
              },
            }}
            contentLabel=""
            className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-16 p-5 overflow-scroll"
          >
            <AddEditHabits
              type={openAddEditHabitModal.type}
              habitData={openAddEditHabitModal.data}
              onClose={() => {
                setOpenAddEditHabitModal({
                  isShown: false,
                  type: "add",
                  data: null,
                });
              }}
              getAllHabits={getAllHabits}
              showToastMessage={showToastMessage}
            />
          </Modal>

          <div className="fixed top-4 right-4 z-50">
            <Toast
              isShown={showToastMsg.isShown}
              message={showToastMsg.message}
              type={showToastMsg.type}
              onClose={handleCloseToast}
            />
          </div>
        </div>
      </div>
  </div>
  );
};

export default CalendarPage;
