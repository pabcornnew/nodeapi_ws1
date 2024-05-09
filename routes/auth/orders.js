const orderModel = require("../../models/orders.model");
const express = require("express");
const router = express.Router();

/* 3] Order */
//get orders product
router.get("/products/:id/orders", async (req, res, next) => {
  try {
    let order = await orderModel.findById({ _id: req.params.id });
    res.status(200).send(order);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//add orders
router.post("/products/:id/orders", async (req, res, next) => {
  try {
    await orderModel.find({});
  } catch (error) {
    return res.status(500).send(error);
  }
});

//show all orders
router.get("/orders", async (req, res, next) => {
  try {
    await orderModel.find({});
  } catch (error) {
    return res.status(500).send(error);
  }
});

/* 3] End Order */
