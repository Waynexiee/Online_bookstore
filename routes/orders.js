const express = require("express");
const router = express.Router();
const data = require("../data/orders");
const cart = require("../data/carts");
const bcrypt = require("bcrypt");
router.get("/", async (req, res) => {
  if (req.cookies && req.cookies.AuthCookie) {
    res.render("partials/new_order", {logged: req.cookies && req.cookies.AuthCookie});
  } else {
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  const userReqData = req.body;
  await data.createNewOrder(userReqData.receiver, userReqData.address, userReqData.payment, req.cookies.AuthCookie);
  await cart.emptyCart(req.cookies.AuthCookie);
  res.redirect("/");
});

router.get("/index", async (req, res) => {
  if (req.cookies && req.cookies.AuthCookie) {
    const order = await data.getAllOrders(req.cookies.AuthCookie);
    res.render("partials/orders", {order: order, logged: req.cookies && req.cookies.AuthCookie});
  } else {
    res.redirect("/", {messages: "Please Log In!"});
  }
});
module.exports = router;

