
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Saivamsi:9652A.saivamsi%40@saivamsi.ywrrka7.mongodb.net/namesDB?retryWrites=true&w=majority&appName=Saivamsi";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "namesDB");

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello this is from Backend Vamsi (MongoDB Connected)" });
});

app.post("/api/verify", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.json({ result: "Please enter a name." });
  }

  try {
    const user = await User.findOne({ name });

    if (user) {
      res.json({ result: `User ${name} found in MongoDB.` });
    } else {
      res.json({ result: `User ${name} not found in MongoDB.` });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ result: "Server error while verifying user." });
  }
});

app.post("/api/add-user", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.json({ message: "Please provide a name" });

  try {
    const newUser = new User({ name });
    await newUser.save();
    res.json({ message: `User ${name} added successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
