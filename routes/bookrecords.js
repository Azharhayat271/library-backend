const express = require('express');
const router = express.Router();
const Bookissue = require('./../schema/issuerecord'); // Assuming you have a 'student' schema defined

router.use(express.json());

router.post('/bookissue', async (req, res) => {
  const { name, regNo, title, ISBN, issueDate, returnDate } = req.body;

  try {
    // Check if a student with the same registration number already exists
    const existingStudent = await Bookissue.findOne({ regNo });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this Registration has Already a Book' });
    }

    const bookrecord = new Bookissue({
      name,
      regNo,
      title,
      ISBN,
      issueDate,
      returnDate
    });

    await bookrecord.save();
    res.status(201).json({ message: 'Book Issue successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/bookissues', async (req, res) => {
  try {
    const bookIssues = await Bookissue.find();
    res.status(200).json(bookIssues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// api to update the record 
router.put('/bookissueupdate/:ISBN', async (req, res) => {
  const { name, regNo, title, ISBN, issueDate, returnDate } = req.body;
  try {
    const bookrecord = await Bookissue.findOne({ _id: req.params.id });

    if (!bookrecord) {
      return res.status(404).json({ error: 'Book Issue not found' });
    }

    bookrecord.name = name;
    bookrecord.regNo = regNo;
    bookrecord.title = title;
    bookrecord.ISBN = ISBN;
    bookrecord.issueDate = issueDate;
    bookrecord.returnDate = returnDate;

    await bookrecord.save();
    res.status(200).json({ message: 'Book Issue updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}); 





module.exports = router;
