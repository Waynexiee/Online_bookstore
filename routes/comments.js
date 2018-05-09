const express = require("express");
const router = express.Router();
const users = require("../data/users");
const books = require("../data/books");
const comments = require("../data/comments");
const path = require("path");

router.post("/:id", async (req, res) => {
    const userReqData = req.body;
    const user = await users.findById (req.cookies.AuthCookie);
    console.log(user);
    console.log(user.username);
    const bookId = req.params.id;
    const book = await books.getBookById(bookId);
    await comments.createComment(user.username, bookId, userReqData.comment);
    res.render('partials/bookTemplate', {book: book, comment: await comments.getAllComments(bookId), logged: (req.cookies && req.cookies.AuthCookie)});
});
router.get("/:id", async (req, res) => {
  const userReqData = req.body;
  
  const user = await users.findById (req.cookies.AuthCookie);
  const bookId = req.params.id;
  const book = await books.getBookById(bookId);
  res.render('partials/bookTemplate', {book: book, comment: await comments.getAllComments(bookId), logged: (req.cookies && req.cookies.AuthCookie)});
});
module.exports = router;
//module.exports = exportedMethods;