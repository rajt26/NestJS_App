const razorPay = require("razorpay");
require("dotenv").config();

const instance = new razorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
    instance,
};
