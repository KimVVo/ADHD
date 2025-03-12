const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: false },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  userId: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  createdOn: { type: Date, default: new Date().getTime() },
  dueDate: { type: Date, required: false },
});

module.exports = mongoose.model("Task", taskSchema);
