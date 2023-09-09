const { Schema, model } = require("mongoose"); 
const joi = require("joi");

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

// ----- СХЕМА МОДЕЛІ ДАНИХ БД "USERS" ----------------------------------------------------------------------------
const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Set password for user'],
            minlength: 6,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: emailRegExp,
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: {
            type : String,
            default: ""
        },
        avatarURL:{
            type: String,
            required: [true, 'Avatar url is required']
        }, 
    },
    {  
        versionKey: false,
        timestamps: true,
    }
);

const User = model('User', userSchema); 



// ----- СХЕМИ ВАЛІДАЦІЇ ДАНИХ В ТІЛІ HTTP-запиту -----------------------------------------------------------
const signUpSchema = joi.object({
    password: joi.string().required().min(6).error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                        case "any.required": 
                                        err.message = "missing required password field";
                                        break;
                        case "string.empty":
                                        err.message = "password field should not be empty!";
                                        break;
                        case "string.min":
                                        err.message = `password field should have at least ${err.local.limit} characters!`;
                                        break;
                        default:
                                        break;
                    }
            });
            return errors;
        }),
    email: joi.string().pattern(emailRegExp).required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required": 
                                    err.message = "missing required email field";
                                    break;
                    case "string.empty":
                                    err.message = "email field should not be empty!";
                                    break;
                    case "string.pattern.base" :
                                    err.message = "email field must be a valid email!";
                                    break;
                    default:
                                        break;
                    }
            });
            return errors;
        }),
});
const signInSchema = signUpSchema;

const updateSubscriptionSchema = joi.object({
    subscription: joi.string().valid("starter", "pro", "business").error(errors => {
        errors.forEach(err => { err.message = "subscription field has wrong value"; });
        return errors;
    }),
});


const schemas = {
    signUpSchema,
    signInSchema,
    updateSubscriptionSchema,
}
  
module.exports = { User, schemas, };