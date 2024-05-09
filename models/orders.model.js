const mongoose = require("mongoose");
const orders = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'products' },
  price: { type: Number },
  quantity: { type: String },
  total: {type: Number}
});

module.exports = mongoose.model("orders", orders);
