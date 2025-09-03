const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { User, Note } = require("./models");
const authMiddleware = require("./authMiddleware");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/notesapp")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// JWT Secret
const JWT_SECRET = "mysecretkey";

//  AUTH ROUTES 

// Signup (email + password, OTP logic can be added later)
app.post("/signup", authMiddleware,async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Error in signup" });
  }
});

// Login
app.post("/login", authMiddleware,async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Error in login" });
  }
});

// NOTES ROUTES 

// Create Note
app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Note text required" });

    const note = new Note({ text:content, userId: req.user.userId });
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error creating note" });
  }
});

// Get Notes
app.get("/notes",authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Delete Note
app.delete("/notes/:id",authMiddleware, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
