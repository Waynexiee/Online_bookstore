const express = require("express");
const router = express.Router();
const data = require("../data/carts");
const bcrypt = require("bcrypt");
router.get("/:id", async (req, res) => {
  if (req.cookies && req.cookies.AuthCookie) {
    const userReqData = req.params;
    const userId = req.cookies.AuthCookie;
    const bookId = userReqData.id;
    const cart = await data.addBookToCart(userId, bookId);
    res.render("partials/item", { layout: null, ...cart });
  } else {
    res.send("Fail");
  }
});

router.get("/", async (req, res) => {
  await data.emptyCart(req.cookies.AuthCookie);
  res.redirect("/");
});
module.exports = router;

