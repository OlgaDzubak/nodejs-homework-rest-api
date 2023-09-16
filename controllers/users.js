const {User} = require("../db/models/user");
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const jimp = require('jimp');
const {v4} = require('uuid');
const path = require("path");
const fs = require("fs").promises;
require('dotenv').config();

const {SECRET_KEY, BASE_URL} = process.env; 

//------ HTTP-запити ----------------------------------------------------------------------------------------

// реєстрація нового користувача
  const register = async (req, res) => {

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
      throw httpError(409, "Email in use"); 
    }
    const hashPassword = await bcrypt.hash(password, 10);
    
    const avatarURL = gravatar.url(email); // отримали url тимчасової аватарки
    const verificationToken = v4();
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken,});

    //відправляємо на email юзера лист для верифікації пошти 
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      "user": {
        email : newUser.email,
        avatarURL: newUser.avatarURL,
        subscription: newUser.subscription
      }
    });
  }

// верифікація електронної пошти юзера  
  const verifyEmail = async(req, res) => {
    const {verificationToken} = req.params;

    const user = await User.findOne({verificationToken});
    if (!user) { throw httpError(404, "User not found"); }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

    res.json({message: "Verification successful"})
  }


// повторная верифікація електроної пошти користувача
  const resendVerifyEmail = async(req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email});
    if (!user) {throw httpError(401, 'User not found')}
    if (user.verify){ throw httpError(400, 'Verification has already been passed') }

    //відправляємо на email юзера лист для верифікації пошти 
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({ message: "Verification email sent" })
  }

// авторизація користувача
  const login = async (req, res) => {
    const {email, password} = req.body;

    //перевіряємо наявність користувача 
    const user = await User.findOne({email});    // шукаємо за email
    if (!user) { throw httpError(401, "Email or password is wrong"); }

    const comparePassword = await bcrypt.compare(password, user.password);   // перевіряємо пароль
    if (!comparePassword){ throw httpError(401, "Email or password is wrong"); }

    if (!user.verify) { throw httpError(401,"Email or password is wrong");}  // перевіряємо чи пройшов email юзера верифікацію

    //створюємо токен
    const payload = { id: user._id };
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

// розавторизація користувача
  const logout = async (req, res) => {
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(_id, {token: ""});
    if (!user) { throw httpError(401, "Not authorized"); }
    res.status(204).json({});
  }

// поверення поточного користувача
  const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;
    res.status(200).json({ email, subscription });
  }

// оновлення даних про підписку поточного користувача
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

//оновлення аватара користувача
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");

  const updateAvatar = async(req, res) =>{

    const { _id } = req.user;                                  // забираємо id поточного юзера з http-запиту
    const { path: tempUpLoad, originalname } = req.file;       // забираємо шлях та ім'я файла-аватара з http-запиту
    const fileName = `${_id}_${originalname}`;                 // формуємо нову назву файла-аватара, включаючи в нього id поточного юзера

    // Змінюємо розмір аватара в тимчасовій папці за допомогою пакету jimp
    const temp_avatar = await jimp.read(tempUpLoad);                  // прочитали зображення
    await temp_avatar.resize(250, 250).writeAsync(tempUpLoad)         // змінили розмір зображення на 250х250 та перезаписали зображення поверх початкового
    
    // переміщуємо аватар на постійне місце розташування
    const resultUpload = path.join(avatarsDir, fileName);      // повний шлях до постійного розташування файлу аватара
    await fs.rename(tempUpLoad, resultUpload);                 // переіменовуємо файл аватара, та переміщаємо йього на постійне місце розташування
    const avatarURL = path.join("avatars", fileName);          // формуємо відносний шлях до файлу аватара avatars/originalname для занесення в БД
    await User.findByIdAndUpdate(_id, {avatarURL});            // оновлюємо поле avatarURL для поточного юзера
    
    res.json({ avatarURL, });

  }



//---------------------------------------------------------------------------------------------------------

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};

