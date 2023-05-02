const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    userTag: String,
    userVerified: { type: Boolean, required: true },
});

module.exports = model('User', userSchema, 'users');
