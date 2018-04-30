const express = require("express");
const router = express.Router();
const data = require("../data/users");
const bcrypt = require("bcrypt");
const path = require("path");
const randomstring = require("randomstring");
router.get("/", async (req, res) => {
  if (req.cookies && req.cookies.AuthCookie) {
    res.redirect('/profile');
  } else {
    res.render('partials/signin', {});
  }
});

router.get("/new", async (req, res) => {
  res.render('partials/signup', {});
});

router.post("/new", async (req, res) => {
  const userReqData = req.body;
  if (userReqData.username && userReqData.password && userReqData.password_confirmation) {
    const username = userReqData.username;
    const password = userReqData.password;
    const passwordConfirmation = userReqData.password_confirmation;
    const emailAddress = userReqData.email_address;
    if (password != passwordConfirmation) {
      res.render('partials/signup', {messages: "Please confirm passwords you input are same!"});
    } else if (await data.findByUsername(username)) {
      res.render('partials/signup', {messages: "Your username has existed, please have another one!"});
    } else {
      bcrypt.hash(password, 2, function (err, hash) {
        data.createNewUser(username, hash, emailAddress);
      });
      res.render("partials/signin", {messages: "You have successfully created your account, please log in."});
    }
  } else {
    res.render('partials/signup', {});
  }
});

router.get("/profile", async (req, res) => {
  if (req.cookies && req.cookies.AuthCookie) {
    const user = await data.findById(req.cookies.AuthCookie);
    if (user) {
      res.render("partials/profile", {profile: user.profile, logged: (req.cookies && req.cookies.AuthCookie)});
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

router.get("/password_email", async (req, res) => {
  const userReqData = req.query;
  const emailAddress = userReqData.email_address;
  const user = await data.findByEmail(emailAddress);
  if (user) {
    const token = await data.saveToken(randomstring.generate(), user._id);
    const url = data.createURL(user._id, token);
    await data.sendPasswordResetMail(emailAddress, url);
    res.render('partials/password_reset', {messages: "Password Reset Email has been sent to your Email Box!"});
  } else {
    res.render('partials/password_reset', {messages: "There is no such user."});
  }
});

router.get("/password", async (req, res) => {
  res.render('partials/password_reset_form', {id: req.query.id, token: req.query.token});
});

router.post("/password", async (req, res) => {
  const userReqData = req.body;
  const id = userReqData.id;
  const user = await data.findById(id);
  if (user && user.token === userReqData.token) {
    bcrypt.hash(userReqData.password, 2, function (err, hash) {
      data.updatePassword(id, hash);
    });
    res.redirect("/");
  } else {
    res.render('partials/password_reset', {messages: "There is no such user."});
  }
});



router.get("/password_reset", async (req, res) => {
  res.render('partials/password_reset', {});
});



module.exports = router;