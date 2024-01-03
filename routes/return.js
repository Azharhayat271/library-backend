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

module.exports = router;
