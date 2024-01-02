const express = require('express');
const router = express.Router();
const Book = require('./../schema/books');

router.use(express.json());

// Add a new book
router.post('/add', async (req, res) => {
  const {
    ISBN,
    title,
    DDC,
    author,
    edition,
    year,
    pages,
    copies,
    publisher,
    rack,
    phone,
    unitPrice,
    totalPrice,
    billNo,
  } = req.body;

  try {
    // Check if a book with the same ISBN already exists
    const existingBook = await Book.findOne({ ISBN });

    if (existingBook) {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }

    const newBook = new Book({
      ISBN,
      title,
      DDC,
      author,
      edition,
      year,
      pages,
      copies,
      publisher,
      rack,
      phone,
      unitPrice,
      totalPrice,
      billNo,
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all books
router.get('/getall', async (req, res) => {
  try {
    const books = await Book.find({}, '-_id'); // Exclude the _id field

    if (books.length === 0) {
      return res.status(404).json({ error: 'No books found' });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a book's information
router.put('/update/:ISBN', async (req, res) => {
  const { ISBN } = req.params;
  const updatedData = req.body;

  try {
    const book = await Book.findOne({ ISBN });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    for (const key in updatedData) {
      if (Object.hasOwnProperty.call(updatedData, key)) {
        book[key] = updatedData[key];
      }
    }

    await book.save();

    res.status(200).json({ message: 'Book information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a book
router.delete('/remove/:ISBN', async (req, res) => {
  const { ISBN } = req.params;

  try {
    const book = await Book.findOne({ ISBN });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await Book.deleteOne({ ISBN });

    res.status(204).send(); // 204 No Content indicates a successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//get a single book on the basis of isbn

// Get a single book by ISBN
router.get('/get/:ISBN', async (req, res) => {
  const { ISBN } = req.params;

  try {
    const book = await Book.findOne({ ISBN });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search books by ISBN or title
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await Book.find({
      $or: [
        { ISBN: { $regex: new RegExp(query, 'i') } },
        { title: { $regex: new RegExp(query, 'i') } },
      ],
    });

    if (results.length === 0) {
      return res.status(404).json({ error: 'No matching books found' });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// an api that will decrese 1 from the number of copies of a book also add validation if number of copies 0 show out of stock
router.put('/decrease/:ISBN', async (req, res) => {
  const { ISBN } = req.params;

  try {
    const book = await Book.findOne({ ISBN });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.copies === 0) {
      return res.status(404).json({ error: 'Out of stock' });
    }

    book.copies = book.copies - 1;

    await book.save();

    res.status(200).json({ message: 'Book copies updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// an api that will increse 1 from the number of copies of a book
router.put('/increase/:ISBN', async (req, res) => {
  const { ISBN } = req.params;

  try {
    const book = await Book.findOne({ ISBN });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.copies = book.copies + 1;

    await book.save();

    res.status(200).json({ message: 'Book copies updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
