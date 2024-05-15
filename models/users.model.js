const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, unique: true, require: true },
    password: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number , default: 0},
    role_id: { type: Number , default: 0}, 
    token: {type: String , default: ''},
    grant_access: {type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
