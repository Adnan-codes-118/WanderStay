if(process.env.NODE_ENV !== "production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

/* ---------------------- BASIC CONFIG ---------------------- */

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");

app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

/* ---------------------- DATABASE ---------------------- */

const dbURL = process.env.ATLASDB_URL;

main()
.then(()=>{
console.log("DB connected");
})
.catch((err)=>{
console.log(err);
});

async function main(){
await mongoose.connect(dbURL);
}

/* ---------------------- SESSION STORE ---------------------- */

const store = MongoStore.create({
mongoUrl: dbURL,
crypto:{
secret: process.env.SECRET,
},
touchAfter: 24 * 3600
});

store.on("error",(err)=>{
console.log("SESSION STORE ERROR", err);
});

const sessionOptions = {
store,
secret: process.env.SECRET,
resave: false,
saveUninitialized: true,
cookie:{
expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
maxAge: 7 * 24 * 60 * 60 * 1000,
httpOnly: true
}
};

app.use(session(sessionOptions));
app.use(flash());

/* ---------------------- PASSPORT AUTH ---------------------- */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---------------------- GLOBAL VARIABLES ---------------------- */

app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
next();
});

/* ---------------------- STATIC PAGES ---------------------- */

app.get("/", (req, res) => {
res.redirect("/listings");
});

app.get("/privacy", (req, res) => {
res.render("privacy.ejs");
});

app.get("/terms", (req, res) => {
res.render("terms.ejs");
});

app.get("/about", (req, res) => {
res.render("about.ejs");
});

app.get("/contact", (req, res) => {
res.render("contact.ejs");
});

/* ---------------------- ROUTERS ---------------------- */

app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

/* ---------------------- 404 HANDLER ---------------------- */

app.use((req,res,next)=>{
next(new ExpressError(404,"Page not found!"));
});

/* ---------------------- ERROR HANDLER ---------------------- */

app.use((err,req,res,next)=>{
let { statusCode = 500, message = "Something went wrong" } = err;
res.status(statusCode).render("error.ejs",{message});
});

/* ---------------------- SERVER ---------------------- */

app.listen(8080,()=>{
console.log("Server running on port 8080");
});
