const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../../models/users.model");
const mongoose = require("mongoose");
const { response } = require("../../app");

/* 1] User login */
//login
router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    let user = await userModel.findOne({
      username: username,
    });

    if (!user) {
      return res.status(500).send({
        message: "Login fail",
        success: false,
      });
    }

    const checkPwd = await bcrypt.compare(password, user.password);

    if (!checkPwd) {
      return res.status(500).send({
        message: "wrong password",
        success: false,
      });
    }

    const { _id, first_name, last_name } = user;

    return res.status(201).send({
      data: { _id, first_name, last_name },
      message: "Login Success!",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "message log: " + error.toString(),
      success: false,
    });
  }
});

//register
router.post("/register", async function (req, res, next) {
  try {
    let { username, password, first_name, last_name, age } = req.body;
    const oldUser = await userModel.findOne({ username });

    if (oldUser) {
      return res.status(409).send("Username is already exist.");
    }

    let hashpwd = await bcrypt.hash(password, 10);

    let user = new userModel({
      username: username,
      password: hashpwd,
      first_name: first_name,
      last_name: last_name,
      age: age,
    });
    //role_id (0 client, 1 admin)

    let save = await user.save();

    const token = jwt.sign({ username, role_id }, process.env.TOKEN_KEY, {
      expiresIn: "1h",
    });
    user.role_id = 0;
    user.token = token;

    res.status(201).send(save);
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

//approve
router.put("/approve/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let update = await userModel.findByIdAndUpdate(id, { grant_access: true });
    return res.status(200).send({
      update,
    });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});
/* 1] End User login */

module.exports = router;
