require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

const connectionString = config.connectionString.replace(
  "<testuser123>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(connectionString)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const User = require("./models/user.model");
const Task = require("./models/task.model");
const Habit = require("./models/habit.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

const validateHabitInput = (req, res, next) => {
  const { notify } = req.body;

  if (
    !Array.isArray(notify) ||
    !notify.every((time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time))
  ) {
    return res.status(400).json({
      error: "Invalid notify format. Must be an array of HH:mm strings.",
    });
  }

  next();
};

app.use(express.json());

const notification = require("./notification");
app.use("/notification", notification);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello world!" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({ error: true, message: "User already exists." });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Successful Registration!",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.status(401).json({ error: true, message: "User not found" });
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createOn: isUser.createOn,
    },
    message: "",
  });
});

// Add Task
app.post("/add-task", authenticateToken, async (req, res) => {
  const { title, content, tags, isCompleted, dueDate } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  try {
    const task = new Task({
      title,
      content: content || "",
      tags: tags || [],
      isCompleted: isCompleted || false, // Ensure isCompleted is handled
      userId: user._id,
      dueDate: dueDate || null,
    });

    await task.save();

    return res.json({ error: false, task, message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Task
app.put("/edit-task/:taskId", authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { title, content, tags, isPinned, isCompleted, dueDate } = req.body; // Add isCompleted to the destructuring
  const { user } = req.user;

  if (
    !title &&
    !content &&
    !tags &&
    isPinned === undefined &&
    isCompleted === undefined &&
    !dueDate // Check if all fields are undefined or null
  ) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });

    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    if (title) task.title = title;
    if (content !== undefined) task.content = content; // Allow content to be an empty string
    if (tags) task.tags = tags;
    if (isPinned !== undefined) task.isPinned = isPinned;
    if (isCompleted !== undefined) task.isCompleted = isCompleted; // Ensure isCompleted is handled
    if (dueDate !== undefined) task.dueDate = dueDate; // Add this line to update dueDate

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error editing task:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Get all tasks
app.get("/get-all-tasks", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const tasks = await Task.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      tasks,
      message: "Tasks retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Delete Task
app.delete("/delete-task/:taskId", authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { user } = req.user;

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });

    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }
    await task.deleteOne({ _id: taskId, userId: user._id });
    return res.json({ error: false, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Update IsPinned Value
app.put("/update-task-pinned/:taskId", authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });

    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    task.isPinned = isPinned;

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task pinned status:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Update IsCompleted Value
app.put(
  "/update-task-completed/:taskId",
  authenticateToken,
  async (req, res) => {
    const taskId = req.params.taskId;
    const { isCompleted } = req.body;
    const { user } = req.user;

    try {
      const task = await Task.findOne({ _id: taskId, userId: user._id });

      if (!task) {
        return res.status(404).json({ error: true, message: "Task not found" });
      }

      task.isCompleted = isCompleted;

      await task.save();

      return res.json({
        error: false,
        task,
        message: "Task updated successfully",
      });
    } catch (error) {
      console.error("Error updating task completed status:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  }
);

// Search for tasks
app.get("/search-tasks/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required" });
  }

  try {
    const matchingTasks = await Task.find({
      userId: user._id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    return res.json({
      error: false,
      tasks: matchingTasks,
      message: "Tasks matching the search query retrieved successfully",
    });
  } catch (error) {
    console.error("Error searching tasks:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Add habit
app.post(
  "/add-habit",
  authenticateToken,
  validateHabitInput,
  async (req, res) => {
    const { name, goal, repeat, color, notify } = req.body;
    const { user } = req.user;

    if (!name) {
      return res.status(400).json({ error: true, message: "Name is required" });
    }

    if (!goal) {
      return res.status(400).json({ error: true, message: "Goal is required" });
    }
    if (!repeat) {
      return res
        .status(400)
        .json({ error: true, message: "Repeat is required" });
    }

    if (!notify) {
      return res
        .status(400)
        .json({ error: true, message: "Notify is required" });
    }

    try {
      const habit = new Habit({
        name,
        goal,
        repeat,
        color,
        notify,
        progress: 0,
        userId: user._id,
      });

      await habit.save();

      return res.json({
        error: false,
        habit,
        message: "Habit added successfully",
      });
    } catch (error) {
      console.error("Error adding habit:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

// Edit habit
// Edit habit
app.put(
  "/edit-habit/:habitId",
  authenticateToken,
  validateHabitInput,
  async (req, res) => {
    const habitId = req.params.habitId;
    const { name, goal, repeat, color, notify, progress } = req.body; // Extract progress from the request body
    const { user } = req.user;

    if (
      !name &&
      !goal &&
      !repeat &&
      !color &&
      !notify &&
      progress === undefined
    ) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided" });
    }

    try {
      const habit = await Habit.findOne({ _id: habitId, userId: user._id });

      if (!habit) {
        return res
          .status(404)
          .json({ error: true, message: "Habit not found" });
      }

      if (name) habit.name = name;
      if (goal) habit.goal = goal;
      if (repeat) habit.repeat = repeat;
      if (color) habit.color = color;
      if (notify) habit.notify = notify;
      if (progress !== undefined) habit.progress = progress; // Update progress only if it's provided

      await habit.save();

      return res.json({
        error: false,
        habit,
        message: "Habit updated successfully",
      });
    } catch (error) {
      console.error("Error editing habit:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  }
);

// Get all habits
app.get("/get-all-habits/", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const habits = await Habit.find({ userId: user._id });
    return res.json({
      error: false,
      habits,
      message: "Habits retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving habits:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Delete habit
app.delete("/delete-habit/:habitId", authenticateToken, async (req, res) => {
  const habitId = req.params.habitId;
  const { user } = req.user;

  try {
    const habit = await Habit.findOne({ _id: habitId, userId: user._id });

    if (!habit) {
      return res.status(404).json({ error: true, message: "Habit not found" });
    }
    await habit.deleteOne({ _id: habitId, userId: user._id });

    return res.json({ error: false, message: "Habit deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Update habit progress
app.put(
  "/update-habit-progress/:habitId",
  authenticateToken,
  async (req, res) => {
    const habitId = req.params.habitId;
    const { user } = req.user;

    try {
      const habit = await Habit.findOne({ _id: habitId, userId: user._id });

      if (!habit) {
        return res
          .status(404)
          .json({ error: true, message: "Habit not found" });
      }

      // Ensure progress is initialized only if it is undefined
      if (habit.progress === undefined) {
        habit.progress = 0;
      }

      // Ensure goal is initialized only if it is undefined
      if (habit.goal === undefined) {
        return res.status(400).json({
          error: true,
          message: "Goal is not defined for this habit",
        });
      }

      console.log(`Current progress: ${habit.progress}, Goal: ${habit.goal}`);
      if (habit.progress < habit.goal) {
        habit.progress += 1;
      } else {
        return res.status(400).json({
          error: true,
          message: "Progress is already at or above the goal",
        });
      }

      await habit.save();

      return res.json({
        error: false,
        habit,
        message: "Habit progress updated successfully",
      });
    } catch (error) {
      console.error("Error updating habit progress:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  }
);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
