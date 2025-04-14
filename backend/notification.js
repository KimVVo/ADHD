const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
router.get("/test", (req, res) => {
  res.send("Notification route is working!");
});
router.post("/notify-task", async (req, res) => {
  const { email, taskTitle, dueDate } = req.body;

  console.log("📩 Email request received with:");
  console.log("Email:", email);
  console.log("Task:", taskTitle);
  console.log("Due Date:", dueDate);

  if (!email || !taskTitle || !dueDate) {
    return res.status(400).json({ message: "Missing fields" });
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
      to: email,
      subject: `Task Reminder: ${taskTitle}`,
      text: `Your task "${taskTitle}" is due at ${dueDate}. Please complete it soon.`,
    });
    console.log("✅ Email sent successfully:", info.response);

    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
