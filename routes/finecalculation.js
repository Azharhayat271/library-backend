// fine.js
const express = require('express');
const router = express.Router();

// Assuming you have a Fine schema defined in a separate file
const Fine = require('./../schema/finecalculation');

router.use(express.json());

// Set default fine per day value
const defaultFinePerDay = 10;

// Get fine per day
router.get('/get', async (req, res) => {
  try {
    const fineData = await Fine.findOne(); // Assuming you have only one record for fine data

    if (!fineData) {
      // If no fine data exists, return the default value
      return res.status(200).json({ finePerDay: defaultFinePerDay });
    }

    res.status(200).json({ finePerDay: fineData.finePerDay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update fine per day
router.put('/update', async (req, res) => {
  const { finePerDay } = req.body;

  try {
    let fineData = await Fine.findOne(); // Assuming you have only one record for fine data

    if (!fineData) {
      // If no fine data exists, create a new record
      fineData = new Fine({ finePerDay: finePerDay || defaultFinePerDay });
    } else {
      // Update existing record
      fineData.finePerDay = finePerDay || fineData.finePerDay;
    }

    await fineData.save();
    res.status(200).json({ message: 'Fine per day updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
