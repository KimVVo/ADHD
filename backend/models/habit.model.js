const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const habitSchema = new Schema({
  name: { type: String, required: true },
  repeat: {
    type: String,
    enum: [
      "daily",
      "weekends",
      "weekdays",
      "weekly",
      "biweekly",
      "monthly",
      "every 3 months",
      "every 6 months",
      "yearly",
    ],
    default: "daily",
  },
  goal: { type: [Number], default: [] },
  color: { type: String, default: "#FFFFFF" },
  notify: {
    type: String,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    required: true,
  }, // Time format HH:mm
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdOn: { type: Date, default: () => new Date().getTime() },
});

module.exports = mongoose.model("Habit", habitSchema);
