const express = require('express');
const ctrl = require('../controllers/contacts');
const validateBody  = require("../middlewares/validateBody.js");
const validateId = require("../middlewares/validateId");
const {schemas} = require("../db/models/contact_model");
const router = express.Router();


router
    .route('/')
    .get(ctrl.getContacts)
    .post(validateBody(schemas.addSchema), ctrl.addContact);

router
    .route('/:contactId')
    .get(validateId, ctrl.getContactById)
    .delete(validateId, ctrl.removeContact)
    .put(validateId, validateBody(schemas.addSchema), ctrl.updateById);

router
    .route('/:contactId/favorite')
    .patch(validateId, validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router;
