const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
  email: String,
  success: Boolean,
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
});

module.exports = mongoose.model("LoginLog", loginLogSchema);
