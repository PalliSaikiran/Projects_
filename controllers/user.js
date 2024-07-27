const User = require("../models/user");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUp = async(req,res)=>{
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
        // req.flash("error",error.message);
        res.redirect("/signup")
    }
}

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to NestVibes!");
    res.redirect(res.locals.redirectUrl  || "/listings");
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if (err) {
           return next(err)
        }
        req.flash("success","you are logged out!")
        // res.redirect("/listings")
        res.redirect("/listings");
    })
}