const verifyToken = require("../../middleware/jwt_decode");
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../../models/users.model");

/* 1] User login */
//login
router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    const user = await userModel.findOne({
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

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    user.token = token;

    return res.status(201).send({
      data: user.token,
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
router.post("/register", async (req, res, next) => {
  try {
    const { user_name, pass_word, firstname, lastname, age } = req.body;

    if (!user_name || !pass_word || !firstname || !lastname || !age) {
      return res.status(400).send({
        message: "All fields are required",
        success: false,
      });
    }
    const haspassword = await bcrypt.hash(pass_word.toString(), 10);

    console.log(haspassword);

    let newUser = new userModel({
      username: user_name,
      password: haspassword,
      first_name: firstname,
      last_name: lastname,
      age: age,
    });

    await newUser.save();

    console.log("ok");

    return res.status(201).send({
      data: newUser,
      message: "success",
      succuess: true,
    });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

//approve
router.put("/approve/:id", verifyToken, async (req, res, next) => {
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

//update
router.put("/edit/user/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const { firstname, lastname, age } = req.body;

    const editUser = new userModel({
      first_name: firstname,
      last_name: lastname,
      age: age
    })

    let update = await userModel.findByIdAndUpdate(id, editUser);
    return res.status(200).send({ update });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});
/* 1] End User login */

module.exports = router;
