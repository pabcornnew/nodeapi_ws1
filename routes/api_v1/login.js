const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../../models/users.model");
const mongoose = require("mongoose");

/* 1] User login */
//login
router.post("/login", async (req, res, next) => {
  try {
    let { usern, pwd } = req.body;
    let hashPwd = await bcrypt.hash(password, 10);

    res.status(200).send("welcome back ");
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

//register
router.post("/register", async function (req, res, next) {
  try {
    let { username, password, first_name, last_name, age } = req.body;
    const oldUser = await userModel.findOne({ username });

    if (oldUser) {
      res.status(409).send("Username is already exist.");
    } else {
      let hashpwd = await bcrypt.hash(password, 10);

      let user = new userModel({
        username: username,
        password: hashpwd,
        first_name: first_name,
        last_name: last_name,
        age: age,
        role_id: 0,
      });
      //role_id (0 client, 1 admin)

      let save = await user.save();

      const token = jwt.sign({ username, role_id }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });

      user.token = token;

      res.status(201).send(save);
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


//approve
router.put("/approve/:id");
/* 1] End User login */


module.exports = router;
