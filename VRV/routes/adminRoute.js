const mongoose = require("mongoose");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (admin) {
      return res
        .status(400)
        .send({ msg: "Admin already register", status: "false" });
    }
    const pass = password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });
    const payload = newAdmin.email;
    const token = await jwt.sign({ payload }, "secret", { expiresIn: "1d" });
    res.status(200).send({ msg: "Admin registered successfully", newAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Inernal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res
        .status(400)
        .send({ msg: "Admin not registerd", status: false });
    }
    const comparePassword = await bcrypt.compare(password, admin.password);
    if (!comparePassword) {
      return res.status(400).send({ msg: "Incorrect Password", status: false });
    }
    const payload = { email: admin.email };
    const token = jwt.sign(payload, "secret", { expiresIn: "1d" });

    res
      .status(200)
      .send({ admin, token, msg: "Login Successfully", status: true });
  } catch (error) {
    res.status(500).send({ msg: "Interal server Error", error });
  }
});

module.exports = router;
