const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const checkAuth = require("../middlewares/check-auth");
const multer = require("multer");
const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"),
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name);
  },
});


//Get all books in BD
router.get("", (req, res) => {
  Book.find({}, (err, books) => {
    if (err)
      return res.status(500).send({ message: `An error has ocurred: ${err}` });
    if (!books)
      return res.status(404).send({ message: `No books in the database` });

    res.status(200).send({ books });
  });
});

//Get one book by id
router.get("/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  Book.findById(bookId, (err, book) => {
    if (err)
      return res.status(500).send({ message: `An error has ocurred: ${err}` });
    if (!book)
      return res.status(404).send({ message: `No books in the database` });

    res.status(200).send({ book });
  });
});

//Post a new book
router.post("", checkAuth, 
multer({ storage }).single("file"),
(req, res) => {
  console.log(req.file);
  const book = new Book({
    name: req.body.name,
    author: req.body.author,
    genre: req.body.genre,
    pages: req.body.pages,
    publisher: req.body.publisher
  });

  book
    .save()
    .then((createdBook) => {
      res.status(201).json({
        message: "Bookd added successfully!", //
        book: {
          ...createdBook, //
          id: createdBook._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error has ocurred adding the book",
      });
    });
});

//Update a book
router.put("/:bookId", checkAuth, (req, res) => {
  const bookId = req.params.bookId;
  let update = req.body;

  Book.findByIdAndUpdate(bookId, { ...update, lastmodified: Date.now() })
    .then((book) => {
      res.status(200).send({ book });
    })
    .catch((err) => {
      res.status(500, { message: `Error updating book: ${err}` });
    });
});

//Delete a book by ID
router.delete("/:bookId", checkAuth, (req, res) => {
  const bookId = req.params.bookId;
  Book.findOneAndRemove(bookId)
    .then((err) => {
      res.status(200).send({ message: "book deleted" });
    })
    .catch((err) => {
      res.status(500, { message: `Error deleting book: ${err}` });
    });
});

module.exports = router;
