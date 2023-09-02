const {User} = require("../db/models/user");
const { httpError, ctrlWrapper } = require('../helpers');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {SECRET_KEY} = process.env;

//------ HTTP-запити ----------------------------------------------------------------------------------------

// реєстрація нового користувача
  const register = async (req, res) => {

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
      throw httpError(409, "Email in use"); 
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
      "user": {
        email : newUser.email,
        subscription: newUser.subscription
      }
    });
  }

// автрризація користувача
  const login = async (req, res) => {
    const {email, password} = req.body;

    //перевіряємо наявність користувача 
    const user = await User.findOne({email});
    if (!user) { throw httpError(401, "Email or password is wrong"); }

    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult){ throw httpError(401, "Email or password is wrong"); }

    const payload = { id: user._id };

    //створюємо токен
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });  // записуємо токен в базу користувачів

    res.status(200).json( {
      token,
      "user": {
        "email": user.email,
        "subscription": user.subscription
      }
    });
  }

  const logout = async (req, res) => {
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(_id, {token: ""});
    if (!user) { throw httpError(401, "Not authorized"); }
    res.status(204).json({});
  }


  const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;
    res.status(200).json({ email, subscription });
  }

  const updateSubscription = async(req, res) => {
    const {subscription} = req.body;
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(_id, {subscription}, {new:true });
    if (!user) { throw httpError(401, "Not authorized"); }
    
    res.status(200).json({
      "user": {
        "email": user.email,
        "subscription": user.subscription
      }
    });
  }

//---------------------------------------------------------------------------------------------------------

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
};
