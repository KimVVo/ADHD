import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd, MdCheck } from "react-icons/md";
import AddEditTasks from "./AddEditTasks";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddTaskImg from "../../assets/images/add_task.svg";
import NoDataImg from "../../assets/images/no_task.svg";
import GreetingCard from "../../components/GreetingCard/GreetingCard";
import Habits from "../../components/Habits/Habits";
import Nav from "../../components/Navbar/Nav";
import "react-toastify/dist/ReactToastify.css";
import AddEditHabits from "../../components/Habits/AddEditHabits";
import Tooltip from "../../components/Tooltip/Tooltip";
import { parseISO, format } from "date-fns";

const Home = () => {
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

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: "add",
    message: "",
  });

  const [allTasks, setAllTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [allHabits, setAllHabits] = useState([]);

  const [isSearch, setIsSearch] = useState(false);
  const [notifiedTasks, setNotifiedTasks] = useState([]);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
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

 const checkDueDates = () => {
    const now = new Date();
    const notificationThreshold = 15 * 60 * 1000; // 15 minutes before due date

    console.log("Checking due dates at:", now.toLocaleTimeString());
    console.log("Total tasks:", allTasks.length);

    allTasks.forEach((task) => {
      console.log(`Task: ${task.title}, ID: ${task._id}`);
      console.log("Due Date Raw:", task.dueDate);

      if (task.dueDate) {
        const dueDate = new Date(task.dueDate); // Parse the due date

        const timeDifference = dueDate - now;

        console.log(
          `Due: ${format(dueDate, "yyyy-MM-dd HH:mm:ss")}, Time Diff: ${(
            timeDifference / 1000
          ).toFixed(0)} seconds`
        );

        if (
          timeDifference >= 0 &&
          timeDifference <= notificationThreshold &&
          !task.isCompleted &&
          !notifiedTasks.includes(task._id)
        ) {
          showToastMessage(
            `Task "${task.title}" is due in 15 minutes! Due: ${format(
              dueDate,
              "yyyy-MM-dd HH:mm:ss"
            )}`,
            "warning"
          );
          // Send email notification
          if (userInfo?.email) {
            axiosInstance.post("notification/notify-task", {
              email: userInfo.email,
              taskTitle: task.title,
              dueDate: format(dueDate, "yyyy-MM-dd HH:mm:ss"),
            });
          }
          setNotifiedTasks((prev) => [...prev, task._id]);
        } else {
          console.log("Task not within 15-minute threshold");
        }
      } else {
        console.log(
          "Task skipped: No due date, completed, or already notified"
        );
      }
    });
  };
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/get-all-tasks");

      if (response.data && response.data.tasks) {
        setAllTasks(response.data.tasks);
        checkDueDates();
      }
    } catch {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const deleteTask = async (data) => {
    try {
      const response = await axiosInstance.delete(`/delete-task/${data._id}`);

      if (response.data && !response.data.error) {
        showToastMessage("Task Deleted Successfully", "delete");
        getAllTasks();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const onSearchTask = async (query) => {
    try {
      const response = await axiosInstance.get("/search-tasks", {
        params: { query },
      });

      if (response.data && response.data.tasks) {
        setIsSearch(true);
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateIsPinned = async (noteData) => {
    const taskId = noteData._id;
    try {
      const response = await axiosInstance.put(
        `/update-task-pinned/${taskId}`,
        {
          isPinned: !noteData.isPinned,
        }
      );

      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateIsCompleted = async (noteData) => {
    const taskId = noteData._id;
    try {
      const response = await axiosInstance.put(
        `/update-task-completed/${taskId}`,
        {
          isCompleted: !noteData.isCompleted,
        }
      );

      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllHabits = async () => {
    try {
      const response = await axiosInstance.get("/get-all-habits");
      if (response.data && response.data.habits) {
        setAllHabits(response.data.habits);
      }
    } catch {
      console.log("An expected error occurred. Please try again.");
    }
  };

  const handleclearSearch = () => {
    setIsSearch(false);
    getAllTasks();
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
      console.log("An expected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks();
    getUserInfo();
    getAllHabits();


    const intervalId = setInterval(() => {
      getAllTasks();
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const incompleteTasks = allTasks.filter((task) => !task.isCompleted);
  const completedTasks = allTasks.filter((task) => task.isCompleted);

  return (
    <div className="min-h-screen flex flex-col z-40 font-montserrat">
      <Navbar
        userInfo={userInfo}
        onSearchTask={onSearchTask}
        handleclearSearch={handleclearSearch}
        showSearchBar={true}
      />

      <div className="flex-1 flex flex-row mt-20">
        <div className="w-20 ml-4">
          <Nav />
        </div>

        <div className="flex-1 px-4 py-12">
          {userInfo && (
            <div className="mt-4 mb-4">
              <GreetingCard username={userInfo.fullName} />
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-[48%]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">My Tasks</h2>
                <div className="relative group">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      setOpenAddEditModal({
                        isShown: true,
                        type: "add",
                        data: null,
                      });
                    }}
                  >
                    <MdAdd className="text-white text-[20px]" />
                  </button>
                  <Tooltip text="Add Task" />
                </div>
              </div>
              {incompleteTasks.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {incompleteTasks.map((item) => (
                    <NoteCard
                      key={item._id}
                      title={item.title}
                      content={item.content}
                      tags={item.tags}
                      dueDate={format(
                        new Date(item.dueDate),
                        "yyyy-MM-dd HH:mm"
                      )} // Convert to local time
                      reminderTime={item.reminderTime}
                      isPinned={item.isPinned}
                      isCompleted={item.isCompleted}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => deleteTask(item)}
                      onPinNote={() => updateIsPinned(item)}
                      onToggleComplete={() => updateIsCompleted(item)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCard
                  imgSrc={isSearch ? NoDataImg : AddTaskImg}
                  message={
                    isSearch
                      ? `Oops! No tasks found matching your search.`
                      : `Create your first task—whether it’s big or small, every step counts!`
                  }
                />
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-[48%]">
              <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
              {completedTasks.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {completedTasks.map((item) => (
                    <NoteCard
                      key={item._id}
                      title={item.title}
                      content={item.content}
                      tags={item.tags}
                      dueDate={item.dueDate}
                      reminderTime={item.reminderTime}
                      isPinned={item.isPinned}
                      isCompleted={item.isCompleted}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => deleteTask(item)}
                      onToggleComplete={() => updateIsCompleted(item)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCard
                  imgSrc={isSearch ? NoDataImg : AddTaskImg}
                  message={
                    isSearch
                      ? `No completed tasks found.`
                      : `Complete a task to see it here!`
                  }
                />
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-8 max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Habits</h2>
              <div className="relative group">
                <button
                  onClick={() => {
                    setOpenAddEditHabitModal({
                      isShown: true,
                      type: "add",
                      data: null,
                    });
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  <MdAdd className="text-white text-[20px]" />
                </button>
                <Tooltip text="Add Habit" />
              </div>
            </div>
            <div className="flex gap-4 mt-2 overflow-x-auto">
              {allHabits.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md font-montserrat"
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
                  <div className="flex items-center gap-2 mt-2">
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
                      Progress: {item.progress}/{item.goal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Modal
            isOpen={openAddEditHabitModal.isShown}
            onRequestClose={() => {}}
            style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
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
        </div>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
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

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
