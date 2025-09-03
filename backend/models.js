const mongoose = require("mongoose");

// User Schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // hashed
// });

// // Note Schema
// const noteSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

// const User = mongoose.model("User", userSchema);
// const Note = mongoose.model("Note", noteSchema);

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  dob: String,
  email: { type: String, unique: true },
  password: String, // not used with OTP but kept for safety
});

const User = mongoose.model("User", userSchema);

//  Notes schema
const noteSchema = new mongoose.Schema({
  userId: String,
  text: String,
});
const Note = mongoose.model("Note", noteSchema);

module.exports = { User, Note };

