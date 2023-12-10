const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../schema/index');

router.use(express.json());

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if the user is active
    if (user.status === 'inactive') {
      return res.status(402).json({ error: 'Your account is not activated' });
    }

    // If the username, password, and status are valid, create a JWT token.
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_secret_key', {
      expiresIn: '1h', 
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
