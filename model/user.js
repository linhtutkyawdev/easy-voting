const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const campaign = require("./campaign");

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
});

User.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  next();
});

User.statics.compare = function (cleartext, encrypted) {
  return bcrypt.compareSync(cleartext, encrypted);
};

module.exports = mongoose.model("users", User);
