const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const cors = require("cors");
const { User, Note } = require("./models");
const authMiddleware = require("./authMiddleware");
const nodemailer = require("nodemailer")

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/notesapp")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// JWT Secret
const JWT_SECRET = "mysecretkey";


//  In-memory OTP store
const otpStore ={};

//  Email transporter (using Gmail here)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yasharth112106@gmail.com",   
    pass: "opencv",      
  },
});

//  OTP Signup
app.post("/signup/send-otp", async (req, res) => {
  const { name, dob, email } = req.body;

  if (!name || !dob || !email) {
    return res.status(400).json({ message: "All fields required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, name, dob, expires: Date.now() + 5 * 60 * 1000 };

  await transporter.sendMail({
    from: "yasharth112106@gmail.com",
    to: email,
    subject: "Your OTP for Signup",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });

  res.json({ message: "OTP sent to email" });
});

app.post("/signup/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name: record.name,
      dob: record.dob,
      email,
    });
    await user.save();
  }

  delete otpStore[email];

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);
  res.json({ token, user });
});

//  OTP Login
app.post("/login/send-otp", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  await transporter.sendMail({
    from: "yasharth112106@gmail.com",
    to: email,
    subject: "Your OTP for Login",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });

  res.json({ message: "OTP sent to email" });
});

app.post("/login/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const user = await User.findOne({ email });
  delete otpStore[email];

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);
  res.json({ token, user });
});

//  AUTH ROUTES (password based,initially)

// Signup (email + password, OTP logic can be added later)
// app.post("/signup", authMiddleware,async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "All fields required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ email, password: hashedPassword});
//     await user.save();

//     res.json({ message: "Signup successful" });
//   } catch (err) {
//     res.status(500).json({ message: "Error in signup"});
//   }
// });

// // Login
// app.post("/login", authMiddleware,async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found"});

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid password"});

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({ token, email: user.email });
//   } catch (err) {
//     res.status(500).json({ message: "Error in login"});
//   }
// });

// NOTES ROUTES 

// Create Note
app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Note text required" });

    const note = new Note({ text:content, userId: req.user.userId});
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error creating note"});
  }
});

// Get Notes
app.get("/notes",authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId});
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes"});
  }
});

// Delete Note
app.delete("/notes/:id",authMiddleware, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId});
    //OR await Note.deleteOne({ _id:req.params.id, userId: req.user.userId})
    res.json({ message: "Note deleted"});
  } catch (err) {
    res.status(500).json({ message: "Error deleting note"});
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
