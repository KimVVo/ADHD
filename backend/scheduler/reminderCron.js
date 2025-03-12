const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const moment = require("moment-timezone");

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Schedule a job to run every hour
cron.schedule("0 * * * *", async () => {
  try {
    const now = moment().tz("America/Chicago"); // Adjust timezone if needed
    const oneHourLater = now.clone().add(1, "hour");

    // Find tasks due within the next hour that have not had a reminder sent
    const tasks = await Task.find({
      dueDate: { $gte: now.toDate(), $lte: oneHourLater.toDate() },
      isCompleted: false,
      reminderSent: { $ne: true },
    }).populate("userId");

    for (const task of tasks) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: task.userId.email,
        subject: "Task Reminder",
        text: `Reminder: Your task "${task.title}" is due at ${moment(
          task.dueDate
        )
          .tz("America/Chicago")
          .format("LLLL")}.`,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
          // Mark the reminder as sent
          task.reminderSent = true;
          await task.save();
        }
      });
    }
  } catch (error) {
    console.error("Error checking for due tasks:", error);
  }
});
