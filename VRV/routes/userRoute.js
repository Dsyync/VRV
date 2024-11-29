const mongoose = require("mongoose");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .send({ msg: "Email already register", status: "false" });
    }
    const pass = password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const payload = newUser.email;
    const token = await jwt.sign({ payload }, "secret", { expiresIn: "1d" });
    res.status(200).send({ msg: "User registered successfully", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Inernal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!User) {
      return res
        .status(400)
        .send({ msg: "Email not registerd", status: false });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).send({ msg: "Incorrect Password", status: false });
    }
    const payload = { email: user.email };
    const token = jwt.sign(payload, "secret", { expiresIn: "1d" });

    res.send({ user, token, msg: "Login Successfully", status: true });
  } catch (error) {
    res.status(500).send({ msg: "Interal server Error", error });
  }
});

router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email: email, role: "Admin" });
    if (!admin) {
      return res.status(400).send({ msg: "Incorrect Email", status: false });
    }
    res.status(200).send(admin);
  } catch (error) {
    res.status(500).send({ msg: "Interal server Error", error });
  }
});
module.exports = router;
