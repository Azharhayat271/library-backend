const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    ISBN: {
        type: String,
        unique: true, 
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    DDC: {
        type: String,
        unique: true, 
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    edition: String,
    year: Number,
    pages: Number,
    copies: {
        type: Number,
        required: true,
    },
    publisher: String,
    rack: String,
    phone: String,
    unitPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    billNo: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
