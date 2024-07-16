const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true },
  phoneNumber: { type: Number, required: true },
  password: { type: String, required: true },

});

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, 
  },
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const longTermUserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true }, 
    vehicleModel: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
  });

//define all models
const User = mongoose.model('User', UserSchema);
const longTermUser = mongoose.model('longTermUser', longTermUserSchema);

module.exports = {
    User,
    longTermUser,
    // Add more models here as needed
  };