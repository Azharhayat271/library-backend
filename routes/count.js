// routes/count.js
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();

// MongoDB Connection String
const mongoURI = 'mongodb://localhost:27017/library'; // Update with your database name

// Middleware to handle JSON data
router.use(express.json());

// Route to get counts for students, books, issued books, and total book copies
router.get('/counts', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db();

    const studentsCollection = db.collection('students');
    const booksCollection = db.collection('books');
    const issueBooksCollection = db.collection('bookissues');

    const totalStudents = await studentsCollection.countDocuments();
    const totalBooks = await booksCollection.countDocuments();
    const totalIssuedBooks = await issueBooksCollection.countDocuments();

    // Calculate total book copies
    const bookDocuments = await booksCollection.find().toArray();
    const totalBookCopies = bookDocuments.reduce((total, book) => total + (book.copies || 0), 0);
    
    res.json({ totalStudents, totalBooks, totalIssuedBooks, totalBookCopies });

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
