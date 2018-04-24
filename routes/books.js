const express = require("express");
const router = express.Router();
const books = require("../data/books");
const path = require("path");
router.get("/", async (req, res) => {
  res.render('partials/books', {product: await books.getAllBooks(), logged: (req.cookies && req.cookies.AuthCookie)});
});

module.exports = router;
