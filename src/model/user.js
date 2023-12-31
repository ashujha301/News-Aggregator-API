const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'Fullname not provided'],
  },
  email: {
    type: String,
    required: [true, 'Email not provided'],
    lowercase: true,
    trim: true,
    unique: [true, 'Email already exists in the database'],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email is not valid!',
    },
  },
  password: {
    type: String,
    required: [true, "Password can't be blank"],
  },
  preferences: {
    type: [String],
    default: [],   
}, 
  created: {
    type: Date,
    default: Date.now,
  },
});

// Create an index on the 'email' field
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
