const joi = require("joi");
const { httpError } = require('../helpers/');

// ----- СХЕМИ ВАЛІДАЦІЇ ДАНИХ В ТІЛІ HTTP-запиту -----------------------------------------------------------
const validationSchema = joi.object({
    name: joi.string().required().min(3).max(30).error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required": 
                                        err.message = "missing required name field";
                                        break;
                        case "string.empty":
                                        err.message = "name field should not be empty!";
                                        break;
                        case "string.min":
                                        err.message = `name field should have at least ${err.local.limit} characters!`;
                                        break;
                        case "string.max":
                                        err.message = `name field should have at most ${err.local.limit} characters!`;
                                        break;
                        default:
                                        break;
                    }
            });
            return errors;
        }),
    email: joi.string().email().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required": 
                                        err.message = "missing required email field";
                                        break;
                        case "string.empty":
                                        err.message = "email field should not be empty!";
                                        break;
                        case "string.email" :
                                        err.message = "email field must be a valid email!";
                                        break;
                        default:
                                        break;
                    }
            });
            return errors;
        }),
    phone: joi.string().pattern(/^\+{0,1}\d{0,3}[\-(]{1}\d{0,3}[\-)]{1}\d{3}\-{0,1}\d{2}\-{0,1}\d{2}$/i, 'phone').required().error(errors => {
        errors.forEach(err => {
            console.log(err);
                switch (err.code) {
                    case "any.required": 
                                        err.message = "missing required phone field";
                                        break;
                    case "string.empty":
                                        err.message = "phone field should not be empty!";
                                        break;
                    case "string.pattern.name":
                                        err.message = "phone field must contain only numbers and symbols '(', ')', '-' and match the pattern: +xx(xxx)xxx-xx-xx, +xx(xxx)xxxxxxx, (xxx)xxx-xx-xx, (xxx)xxxxxxx !";
                                        break;                        
                    default:
                                        break;
                    }
        });
        
        return errors;
        }),
});

module.exports = { validationSchema, };