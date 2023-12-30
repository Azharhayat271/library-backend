// fine.js
const express = require("express");
const router = express.Router();

// Assuming you have a Fine schema defined in a separate file
const Fine = require("./../schema/finecalculation");

router.use(express.json());

// Set default fine per day value
const defaultFinePerDay = 10;

// Get fine per day
// Get fine data including ID
router.get("/get", async (req, res) => {
  try {
    const fineData = await Fine.findOne(); // Assuming you have only one record for fine data

    if (!fineData) {
      // If no fine data exists, return the default value
      return res.status(200).json({ id: null, finePerDay: defaultFinePerDay });
    }

    res.status(200).json({ id: fineData._id, finePerDay: fineData.finePerDay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update fine per day
// Update fine per day based on ID in the request body
router.put("/update", async (req, res) => {
  const { id, finePerDay } = req.body;

  try {
    if (!id) {
      res.status(400).json({ error: "ID is required in the request body" });
      return;
    }

    let fineData = await Fine.findById(id);

    if (!fineData) {
      res.status(404).json({ error: "Fine data not found" });
      return;
    }

    // Update existing record
    fineData.finePerDay = finePerDay || fineData.finePerDay;

    await fineData.save();
    res.status(200).json({ message: "Fine per day updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
