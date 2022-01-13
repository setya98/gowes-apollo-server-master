const {model, Schema} = require('mongoose')

const chatSchema = new Schema({
    lastText: String,
    users: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
    sentAt: String
});

module.exports = model('Chat', chatSchema)