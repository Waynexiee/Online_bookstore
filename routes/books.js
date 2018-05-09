const express = require("express");
const router = express.Router();
const books = require("../data/books");
const path = require("path");
router.get("/", async (req, res) => {
  res.render('partials/books', {product: await books.getAllBooks(), logged: (req.cookies && req.cookies.AuthCookie)});
});

router.get("/search", async (req, res) => {
  const bookTitle = req.query.search_word;
  res.render('partials/books', {product: await books.searchByTitle(bookTitle), logged: (req.cookies && req.cookies.AuthCookie)});
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const book = await books.getBookById(id);
  res.render('partials/bookTemplate', {book: book, logged: (req.cookies && req.cookies.AuthCookie)});
});
module.exports = router;
