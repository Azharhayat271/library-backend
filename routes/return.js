const express = require("express");
const router = express.Router();
const BookReturn = require("./../schema/return");
const BookIssue = require("./../schema/issuerecord");
const Book = require("./../schema/books"); // Assuming you have a Book model

// POST /return-book
router.post("/return-book", async (req, res) => {
  try {
    const bookReturnData = req.body;

    // Save the return record
    const bookReturn = new BookReturn(bookReturnData);
    await bookReturn.save();

    // Delete the corresponding record from the bookissues collection
    await BookIssue.deleteOne({ regNo: bookReturnData.regNo }); // Adjust the condition based on your schema

    // Increment the 'copies' field in the books collection
    const book = await Book.findOne({ ISBN: bookReturnData.ISBN }); // Assuming ISBN is the unique identifier
    if (book) {
      book.copies += 1;
      await book.save();
    } else {
      console.error("Book not found in the books collection");
    }

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /return-book where totalFine is greater than 0
router.get("/getall", async (req, res) => {
  try {
    const bookReturns = await BookReturn.find({ totalFine: { $gt: 0 } });
    res.status(200).json(bookReturns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /pay-now
router.post('/paynow', async (req, res) => {
  try {
    const { id } = req.body; // Assuming 'id' is the unique identifier for records in the return collection

    // Update the payment status, totalFine, additionalFine, and fine fields in the return collection
    await BookReturn.findOneAndUpdate({ _id: id }, { isPaid: true, totalFine: 0, additionalFine: 0, fine: 0 });

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get api to get all the records
router.get("/getallrecords", async (req, res) => {
  try {
    const bookReturns = await BookReturn.find();
    res.status(200).json(bookReturns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
