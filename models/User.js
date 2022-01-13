const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  email: String,
  password: String,
  phone: String,
  address: {
    cityName: String,
    cityId: String,
    district: String,
    postalCode: String,
    detail: String,
  },
  balance: Number,
  buyer: {
    id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    name: String,
    birthDate: String,
    avatar: String,
    createdAt: String,
  },
  seller: {
    id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    username: String,
    avatar: String,
    description: String,
    createdAt: String,
  },
});

module.exports = model("User", userSchema);
