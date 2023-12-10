const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schema/signup'); 

router.use(express.json());

router.post('/', async (req, res) => {
  const { username, password, email, name, contactNumber, gender, dateOfBirth, country, state } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      name,
      contactNumber,
      gender,
      dateOfBirth,
      country,
      state,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET route to retrieve user information by username
router.get('/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username }, { password: 0 }); 

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
