const joi = require("joi");

// ----- СХЕМИ ВАЛІДАЦІЇ ДАНИХ В ТІЛІ HTTP-запиту -----------------------------------------------------------
const validationSchema = joi.object({
    name:  joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    phone: joi.string().pattern(/^\+{0,1}\d{0,3}[\-(]{0,1}\d{3}[\-)]{0,1}\d{3}\-{0,1}\d{2}\-{0,1}\d{2}$/i, 'phone').required()
});

module.exports = { validationSchema, };