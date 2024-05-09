const mongoose = require("mongoose");
const orders = new mongoose.Schema({
  order_name: { type: String },
  amount: { type: Number },
});

module.exports = mongoose.model("orders", orders);
