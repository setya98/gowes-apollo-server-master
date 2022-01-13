const {model, Schema} = require('mongoose')

const cartSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    note: String,
    isChecked: Boolean,
    amountItem: Number,
    createdAt: String
});

module.exports = model('Cart', cartSchema)