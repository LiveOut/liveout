const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchemaTemplate = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
};

const UserSchema = new Schema(userSchemaTemplate);
const User = mongoose.model("users", UserSchema);
module.exports = User;
