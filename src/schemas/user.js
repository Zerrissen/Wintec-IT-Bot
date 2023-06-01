const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    userName: String, // Discord is getting rid of the tag system :(
    userVerified: { type: Boolean, required: true, default: false },
});

module.exports = model('User', userSchema, 'users');
