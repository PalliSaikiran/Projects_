const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirecturl } = require('../middleware.js');
const userController = require('../controllers/user.js')

router.get("/signup",userController.renderSignUpForm)

router.post("/signup",wrapAsync(userController.signUp))

router.get("/login",userController.loginForm)

router.post("/login",saveRedirecturl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),userController.login)

router.get("/logout",userController.logout)

module.exports = router;
