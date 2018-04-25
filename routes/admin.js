const express = require("express");
const router = express.Router();
const books = require("../data/books");
router.get("/", async (req, res) => {
  res.render('partials/upload', {product: await books.getAllBooks(), logged: (req.cookies && req.cookies.AuthCookie)});
});

router.post("/", async (req, res) => {
  const newBook = req.body;
  const result = await books.addBook(newBook.title, newBook.price, newBook.author, newBook.stock, newBook.picture_url, newBook.description);
  if (result) {
    res.render('partials/books', {product: await books.getAllBooks(), logged: (req.cookies && req.cookies.AuthCookie), messages: "Add book successfully!"});
  } else {
    res.render('partials/upload', {logged: (req.cookies && req.cookies.AuthCookie), messages: "Add new book failed! Please input again!"})
  }
});

module.exports = router;

