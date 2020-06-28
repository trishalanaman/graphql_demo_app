const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email: { 
        type: String, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    code: String,
    attempt: Number
});

module.exports = mongoose.model('Otp', otpSchema);