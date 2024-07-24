const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirecturl } = require('../middleware.js');


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        let newUser = new User({
            username,
            email
        })
        let regUSer = await User.register(newUser,password);
        req.login(regUSer,(err)=>{
            if (err) {
                return next(err);
            }
            req.flash("success","Welcome to nestVibes!!")
            res.redirect("/listings")
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup")
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",saveRedirecturl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),async(req,res)=>{
    req.flash("success","welcome back to NestVibes!");
    res.redirect(res.locals.redirectUrl  || "/listings");
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if (err) {
           return next(err)
        }
        req.flash("success","you are logged out!")
        // res.redirect("/listings")
        res.redirect("/listings");
    })
})

module.exports = router;
