const express = require("express");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../back_env");

const router = express.Router();

router.post("/signup", (req, res) => {
  let email = req.body.email.toLowerCase();
  let username = req.body.username;
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email,
      password: hash,
      username,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "The email or the username already exists",
        });
      });
  });
});

router.post("/signin", (req, res) => {
  let email = req.body.email.toLowerCase();
  let fetchedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        env.JWT_KEY,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 24,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    });
});

module.exports = router;
