const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: "String", required: true },
  password: { type: "String", required: true },
  email: {
    type: "String",
    required: false,
    default: ''
  },
  pic: {
    type: "String",
    required: false,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
},
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
