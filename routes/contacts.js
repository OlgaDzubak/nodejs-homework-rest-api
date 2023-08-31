const express = require('express');
const ctrl = require('../controllers/contacts');
const {validateBody, validateId, validateFavorite, validateQuery, authenticate}  = require("../middlewares");
const {schemas} = require("../db/models/contact");
const router = express.Router();


router
    .route('/')
    .get(authenticate, validateQuery(schemas.getSchema) ,ctrl.getContacts)
    .post(authenticate, validateBody(schemas.addSchema), ctrl.addContact);

router
    .route('/:contactId')
    .get(authenticate, validateId, ctrl.getContactById)
    .delete(authenticate, validateId, ctrl.removeContact)
    .put(authenticate, validateId, validateBody(schemas.addSchema), ctrl.updateById);

router
    .route('/:contactId/favorite')
    .patch(authenticate, validateId, validateFavorite(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router;
