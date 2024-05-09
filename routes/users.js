const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = require("../models/users.model");

/*---------------------------- Config Upload File ------------------------------ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

/*---------------------------- ------------------- ------------------------------ */

// ---------- /users -------------
/* GET users listing. */

router.get("/", async function (req, res, next) {
  try {
    let users = await userSchema.find({});

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

/* POST */
router.post("/add", async function (req, res, next) {
  try {
    let { username, password, first_name, last_name, age, role_id } = req.body;
    const oldUser = await userSchema.findOne({ username });

    if (oldUser) {
      res.status(409).send("Username is already exist.");
    } else {
      let hashpwd = await bcrypt.hash(password, 10);

      let user = new userSchema({
        username: username,
        password: hashpwd,
        first_name: first_name,
        last_name: last_name,
        age: age,
        role_id: role_id,
      });

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

/* PUT */
router.put("/update/:id", async function (req, res, next) {
  try {
    let { first_name, age } = req.body;

    let update = await userSchema.findByIdAndUpdate(
      req.params.id,
      { first_name, age },
      { new: true }
    );

    res.status(201).send(update);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

/* DELETE */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    let delete_user = await userSchema.findByIdAndDelete(req.params.id);

    res.status(200).send(delete_user);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
