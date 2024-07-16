// backend/routes/auth.js
const express = require('express');
const { User } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register route
router.post('/signup', async (req, res) => {
  console.log(req.body);
  const { userName, email, phoneNumber, password } = req.body;
  if (!userName || !phoneNumber || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }
  try {
    let user = await User.findOne({ phoneNumber });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ userName, email, phoneNumber, password });
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    
    res.status(500).send('Server error');
    console.error(err);
  }
});

// route for fetching users
// router.get('/', async (req, res) => {
//     try {
//       const users = await User.find();
//       res.status(200).json(users);
//     } catch (error) {
//       res.status(500).send({ error: 'Error fetching users', details: error.message });
//     }
//   });

// Login route
  router.post('/login', async (req, res) => {
    console.log(req.body);

    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ msg: 'Please provide both username and password' });
    }
    
    try {
      let user = await User.findOne({ userName });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      const salt = await bcrypt.genSalt(10);
      const password2 = await bcrypt.hash(password, salt);
      console.log(password2);
      next();
      console.log(password)

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid credentials' });
      }
  
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;
