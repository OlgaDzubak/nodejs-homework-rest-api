const express = require('express');
const ctrl = require('../controllers/users');
const {validateBody, authenticate, upload}  = require("../middlewares");

const {schemas} = require("../db/models/user");

const router = express.Router();


router
    .route('/register')
    .post(validateBody(schemas.signUpSchema), ctrl.register);   //запит на реєстрацію нового користувача

router
    .route('/login')
    .post(validateBody(schemas.signInSchema), ctrl.login);      //запит на авторизацію існуючого користувача

router
    .route('/logout')
    .post(authenticate, ctrl.logout);                           //запит на розавторизацію існуючого користувача

router
    .route('/current')
    .get(authenticate, ctrl.getCurrent);                        //запит на отримання інформації про поточного користувача

router
    .route('/')
    .get(ctrl.getAllUsers)
    .patch(authenticate, validateBody(schemas.updateSubscriptionSchema), ctrl.updateSubscription); //запит на оновлення даних про підписку поточного користувача

router
    .route('/avatars')
    .patch(authenticate, upload.single("avatar") , ctrl.updateAvatar);    //запит на оновлення аватара поточного користувача


module.exports = router;