if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js")
const flash = require("connect-flash");
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")
const multer  = require('multer')
// const Mongo_URL = 'mongodb://127.0.0.1:27017/NestVibes'

var methodOverride = require('method-override')
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")))
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended:true}));
var session = require('express-session')
const MongoStore = require('connect-mongo');

const dbUrl = process.env.ATLASDB_URL

main()
.then(()=>{
    console.log("Db is connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(8080,()=>{
    console.log("listening to port 8080")
})

const store =  MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
})

store.on('error',()=>{
  console.log("error on mongo session store",err)
})

app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to false for development
}));
app.use(flash())



app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next()
})

//demo user
// app.get("/demoUser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   })

//   let regStudent = await User.register(fakeUser,"helloworld");
//   res.send(regStudent);
// })

//routes
app.use("/listings/", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",users)

// app.get("/",(req,res)=>{
//   res.send("working")
// })

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!! "))
})

app.use((err,req,res,next) =>{
  // res.send("soemthing went wrong")
  let {statusCode=500,message="something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message})
  // res.status(statusCode).send(message);
})




















//  Tesing
// app.get("/testLink", asy nc (req,res)=>{
//  let test= new Listing({  
//   title:"villa",
//   description:"near lawgate",
//   price:7000,
//   place:"lawgate",
//   country:"India"
//  })
//  test.save().then(()=>{
//   console.log("data succesfully saved")
//  })
// })

 
