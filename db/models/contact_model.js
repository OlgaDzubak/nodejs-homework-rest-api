const { Schema, model } = require("mongoose");
const joi = require("joi");


// ----- СХЕМИ МОДЕЛІ ДАНИХ БД ----------------------------------------------------------------------------
const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      minlength: 3,
      maxlenght: 30,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
},
  {  
    versionKey: false,
});

const Contact = model('Contact', contactSchema);


// ----- СХЕМИ ВАЛІДАЦІЇ ДАНИХ В ТІЛІ HTTP-запиту -----------------------------------------------------------
const addSchema = joi.object({
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
    favorite: joi.boolean().required().error(errors => {
      errors.forEach(err => {
              switch (err.code) {
                  case "any.required": 
                                      err.message = "missing required favorite field";
                                      break;
                  case "string.empty":
                                      err.message = "favorite field should not be empty!";
                                      break;
                  default:
                                      break;
                  }
        });

        return errors;
        }),
});


const updateSchema = joi.object({
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
  favorite: joi.boolean(),
});


const updateFavoriteSchema = joi.object({
    favorite: joi.boolean().required().error(errors => {
      errors.forEach(err => {
              switch (err.code) {
                  case "any.required": 
                                      err.message = "missing field favorite";
                                      break;
                  default:
                                      break;
                  }
        });

        return errors;
        }),
      
});


const schemas = {
  addSchema,
  updateFavoriteSchema,
}

module.exports = { Contact, schemas, };