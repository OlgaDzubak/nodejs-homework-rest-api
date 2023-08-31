const express = require('express');
const ctrl = require('../controllers/auth');
const {validateBody, authenticate}  = require("../middlewares");

const {schemas} = require("../db/models/user");

const router = express.Router();


router
    .route('/users/register')
    .post(validateBody(schemas.signUpSchema), ctrl.register);

router
    .route('/users/login')
    .post(validateBody(schemas.signInSchema), ctrl.login);

router
    .route('/users/logout')
    .post(authenticate, ctrl.logout);

router
    .route('/users/current')
    .post(authenticate, ctrl.getCurrent);

router
    .route('/users')
    .patch(authenticate, validateBody(schemas.updateSubscriptionSchema), ctrl.updateSubscription);    

module.exports = router;