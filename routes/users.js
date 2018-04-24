const express = require("express");
const router = express.Router();
const data = require("../data/users");
const bcrypt = require("bcrypt");
const path = require("path");
router.get("/", async (req, res) => {
  if (req.cookies && req.cookies.AuthCookie) {
    res.redirect('/profile');
  } else {
    res.render('partials/signin', {});
  }
});

router.get("/profile", async (req, res) => {
  if (req.cookies && req.cookies.AuthCookie) {
    const user = await data.findById(req.cookies.AuthCookie);
    if (user) {
      res.render("partials/profile", {profile: user.profile});
    } else {
      res.status(404).json({ messages: "Cannot find you!" });
    }
  } else {
    res.status(403).render('partials/failure', {});
  }
});

router.post("/login", async (req, res) => {
  const userReqData = req.body;
  const username = userReqData.username;
  const user = await data.findByUsername(username);
  if (!user) {
    res.render('partials/signin', { messages : "You don't provide a valid username / password "});
    return;
  }
  const plainTextPassword = userReqData.password;
  const isMatched = await bcrypt.compare(plainTextPassword, user.hashedPassword);
  if (isMatched) {
    res.cookie('AuthCookie', user._id , { expires: new Date(Date.now() + 900000) });
    res.redirect('/');
  } else {
    res.render('partials/signin', {messages : "You don't provide a valid username / password "});
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("AuthCookie");
  res.render('partials/signin', {messages : "You have logged out!"});
});



module.exports = router;