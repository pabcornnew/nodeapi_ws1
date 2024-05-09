const productModel = require("../../models/products.model");
const express = require("express");
const router = express.Router();
/* 2] Products */
//get products
router.get("/products", async (req, res, next) => {
  try {
    let products = await productModel.find({});

    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//get a product
router.get("/products/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let products = await productModel.findById({ _id: id });

    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//add product
router.post("/products", (req, res, next) => {
  try {
    let { product_name, price, amount } = req.body;
    let newProduct = new productModel({
      product_name: product_name,
      price: price,
      amount: amount,
    });

    let saveproduct = newProduct.save();
    let { _id } = saveproduct;

    res.status(201).send({
      data: { _id, product_name, price, amount },
      message: "product added",
      sccuess: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error,
      sccuess: true,
    });
  }
});

//update product
router.put("/products/:id", async (req, res, next) => {
  try {
    let id = req.params.id;

    let { product_name, price, amount } = req.body;

    let update = await productModel.findByIdAndUpdate(
      id,
      { product_name: product_name, price: price, amount: amount },
      { new: true }
    );

    res.status(201).send(update);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//delete product
router.delete("/products/:id", async (req, res, next) => {
  try {
    let delete_user = await productModel.findByIdAndDelete(req.params.id);

    return res.status(200).send(delete_user);
  } catch (error) {
    return res.status(500).send(error);
  }
});
/* 2] End Products */

module.exports = router;
