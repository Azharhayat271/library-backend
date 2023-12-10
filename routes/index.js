const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../schema/index');

router.use(express.json());

router.post('/', async (req, res) => {
  const { username, password, email } = req.body;

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
      email
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, email: 1, status: 1, _id: 0 ,role:1});

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/updatestatus/:username', async (req, res) => {
  const { username } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's status
    user.status = status;
    await user.save();

    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/delete/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await User.findOneAndDelete({ username });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
