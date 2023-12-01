const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const verifyToken = require('./middeware/verifytoken');
const app = express();
require("dotenv").config();

let port = process.env.PORT || 3000;

//Body parsing middleware
app.use(express.json());

//-------------------------------------------------------XXXX---------------------------------------------------------------------------------
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

//-------------------------------------------------------XXXX---------------------------------------------------------------------------------
//Register new user
app.post("/register", async (req, res) => {
  try {
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      role: req.body.role,
      password: bcrypt.hashSync(req.body.password, 8),
      preferences: req.body.preferences || [],
    });

    const savedUser = await user.save();

    return res
      .status(200)
      .json({ message: "user saved successfully", data: savedUser });
  } catch (err) {
    console.error("Error saving user:", err);

    if (err.code === 11000) {
      // Duplicate key error (unique index violation), handle accordingly
      return res
        .status(400)
        .json({ message: "Email already exists", error: err.message });
    }

    return res
      .status(400)
      .json({ message: "user saving failed", error: err.message });
  }
});
//-------------------------------------------------------XXXX---------------------------------------------------------------------------------
//Login user
app.post("/login", (req, res) => {
  try {
    let emailPassed = req.body.email;
    let passwordPassed = req.body.password;

    User.findOne({
      email: emailPassed,
    }).then((user) => {
      var passwordIsValid = bcrypt.compareSync(passwordPassed, user.password);

      if (!passwordIsValid) {
        return res.status(400).send("Invalid passoword");
      }

      // Create and sign a JWT token for the user
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({ message: "Login successful", token });
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
});

//-------------------------------------------------------XXXX---------------------------------------------------------------------------------
// Retrieve news preferences for the logged-in user
app.get('/preferences', verifyToken, async (req, res) => {
  try {
    // Fetch user preferences from the database based on req.user.userId
    const userPreferences = await User.findById(req.user.userId, 'preferences');

    return res.status(200).json({ preferences: userPreferences.preferences });
  } catch (err) {
    console.error('Error retrieving preferences:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.listen(port, (err) => {
  if (err) {
    console.log("Some error encountered");
  } else {
    console.log(`Server started on port ${port}`);
  }
});
