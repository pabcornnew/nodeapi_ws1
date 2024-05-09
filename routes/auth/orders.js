const orderModel = require("../../models/orders.model");
const express = require("express");
const router = express.Router();

/* 3] Order */
//get orders product
router.get("/products/:id/orders", async (req, res, next) => {
  try {
    let order = await orderModel
      .findById({ _id: req.params.id })
      .populate("productId")
      .exec();
    res.status(200).send(order);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//add orders
router.post("/products/:id/orders", async (req, res, next) => {
  try {
    let { quantity } = req.body;
    let id = req.params.id;

    const getProduct = await productModel.findById({ id });

    if (!getProduct) {
      return res.status(404).send({
        message: "Not found",
        succuess: false,
      });
    }

    if (getProduct.amount <= quantity) {
      return res.status(400).send({
        message: "Out of Stock in " + getProduct.amount,
        succuess: false,
      });
    }
    const total = getProduct.amount * quantity;

    const neworder = new orderModel({
      productId: id,
      price: getProduct.price,
      quantity: quantity,
      total: total,
    });

    const order = await neworder.save();

    getProduct.amount -= quantity;

    await getProduct.save();

    return res.status(201).send({
      data: order,
      message: "product added",
      sccuess: true,
    });
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
