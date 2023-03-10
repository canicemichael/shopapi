const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    return res
      .status(404)
      .json({ message: "The user with the given ID was not found" });
  }
  res.status(200).send(user);
});

router.post("/register", async (req, res) => {
  let salt = bcrypt.genSaltSync(10);
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, salt),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(404).send("the user cannot be created!");

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1w" }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("wrong email or password");
  }
});

router.delete("/:id", async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, err });
    });
});

router.get("/get/count", async (req, res) => {
  // mongoose has alot of methods, where we can get the total amount of a particular entity or documents n many of methods like that

  User.countDocuments(function (err, c) {
    if (!c) {
      res.status(500).json({ success: false });
    } else {
      res.status(200).json({ userCount: c });
    }
  });
});

module.exports = router;
