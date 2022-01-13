const { model, Schema } = require("mongoose");

const orderSchema = new Schema({
  items: [
    {
      id: String,
      name: String,
      price: Number,
      weight: Number,
      images: [{ downloadUrl: String }],
      amountItem: Number,
      note: String,
    },
  ],
  seller: {
    username: String,
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  logs: [
    {
      stateType: String,
      succsededAt: String,
      executedAt: String,
    },
  ],
  shipping: {
    awbNumber: String,
    courierName: String,
    buyerAddress: String,
    shippingCost: String,
  },
  state: {
    stateType: String,
    createdAt: String,
    deadline: String,
  },
});

module.exports = model("Order", orderSchema);
