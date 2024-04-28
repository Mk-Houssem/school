// import express module
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

//create User schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  pwd: String,
  role: String,
  status: String,
  speciality: String,
  address: String,
  telChild: String,
  tel: { type: String, unique: true },
  file: String,
});
userSchema.plugin(uniqueValidator);
// Affect User Schema to Model Name User
const user = mongoose.model("User", userSchema);

// Make match exportable
module.exports = user;