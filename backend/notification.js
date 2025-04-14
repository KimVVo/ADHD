const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { authenticateToken } = require("./utilities");
router.get("/test", (req, res) => {
  res.send("Notification route is working!");
});

router.post("/notify-task", authenticateToken, async (req, res) => {
  const { taskTitle, dueDate } = req.body;
  const { user } = req.user; // Extract user from JWT (set by authenticateToken)

  console.log("📩 Email request received with:");
  console.log("User:", user.email);
  console.log("Task:", taskTitle);
  console.log("Due Date:", dueDate);

  // Validate required fields
  if (!taskTitle || !dueDate) {
    return res
      .status(400)
      .json({ message: "Task title and due date are required" });
  }

  // Validate user email
  if (!user.email) {
    return res.status(400).json({ message: "User email not found" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email, // Use email from authenticated user
      subject: `Task Reminder: ${taskTitle}`,
      text: `Your task "${taskTitle}" is due at ${dueDate}. Please complete it soon.`,
    });

    console.log("✅ Email sent successfully");
    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.error("Email error:", err);
    res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
});

module.exports = router;
