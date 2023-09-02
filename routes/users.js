const express = require('express');
const ctrl = require('../controllers/users');
const {validateBody, authenticate}  = require("../middlewares");

const {schemas} = require("../db/models/user");

const router = express.Router();


router
    .route('/register')
    .post(validateBody(schemas.signUpSchema), ctrl.register);

router
    .route('/login')
    .post(validateBody(schemas.signInSchema), ctrl.login);

router
    .route('/logout')
    .post(authenticate, ctrl.logout);

router
    .route('/current')
    .get(authenticate, ctrl.getCurrent);

router
    .route('/')
    .patch(authenticate, validateBody(schemas.updateSubscriptionSchema), ctrl.updateSubscription);    

module.exports = router;