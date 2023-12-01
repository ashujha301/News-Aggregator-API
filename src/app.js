const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const app = express();
require("dotenv").config();

let port = process.env.PORT || 3000;

//Body parsing middleware
app.use(express.json());

//mongoDB connection
try {
  mongoose.connect("mongodb://127.0.0.1:27017/usersdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 3000,
  });
  console.log("Connected to the db");
} catch (err) {
  console.log("Error connecting to the db:", err.message);
}

app.get("/", (req, res) => {
  res.status(200).send("News Aggregator API application!!");
});

//Register new user
app.post("/register", async (req, res) => {
    try {
      const user = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password, 8),
      });
  
      const savedUser = await user.save();
  
      return res.status(200).json({ message: "user saved successfully", data: savedUser });
    } catch (err) {
      console.error("Error saving user:", err);
  
      if (err.code === 11000) {
        // Duplicate key error (unique index violation), handle accordingly
        return res.status(400).json({ message: "Email already exists", error: err.message });
      }
  
      return res.status(400).json({ message: "user saving failed", error: err.message });
    }
  });

//Login user


app.listen(port, (err) => {
  if (err) {
    console.log("Some error encountered");
  } else {
    console.log(`Server started on port ${port}`);
  }
});
