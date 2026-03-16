const mongoose = require("mongoose");

/*--------------------*/

const leaveSchema = new mongoose.Schema({
  leavedate: {
    type: Date,
    required: true,
  },
  leavefromdate: {
    type: Date,
    required: true,
  },
  leavetodate: {
    type: Date,
    required: true,
  },
  leavereason: {
    type: String,
    required: true,
  },

  adminaction: {
    type: Date,
    default: null,
  },

  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Applied", "Approved", "Rejected", "Expired"],
    default: "Applied",
  },
});

/*--------------------*/

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    notempty: true,
    required: true,
    lowercase:true,
  },
  email: {
    type: String,
    required: true,
    notempty: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: { type: Number },

  salary: { type: String, default: "3000$" },

  role: {
    type: String,
    enum: ["Admin", "Employee"],
    default: "Employee",
    required: true,
  },
 
  leaveStatus: {
    type: String,
    enum: ["Not Applied", "Applied", "Approved", "Rejected"],
    default: "Not Applied",
  },
  leaves: {
    type: [leaveSchema],
    default: [],
  },

  profileImage: {
    type: String,
    required: false,
  },
  Address: {
    type: String,
    required: false,
  },
  Mobile: {
    type: String,
    required: false,
  },
  Date_of_birth: {
    type: String,
    required: false,
  },
  resetOTP: { type: String, default:null ,},
  resetOTPExpiry: {
    type: Date, default :null,
  },

  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
