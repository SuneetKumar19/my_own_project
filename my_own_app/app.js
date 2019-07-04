var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/video_editor_app", { useNewUrlParser: true });
var User = require("./models/user");
// for login and signup ================ initializations=============

app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "Salvation Lies within",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({ extended: true }));
// =================================================================

// With this we need not to add .ejs after every file


// in public directory we save our js and css files now it has been linked to app.js
app.use(express.static(__dirname + "/public"));

// We can use curretUser in all ejs files===
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
// Route for our homepage========================================================================>>>>>
app.get("/", function(req, res) {
    res.render("homepage");
});

// homepage route ends here===============================================================================================>>>>



// Route to tools page===========================


app.get("/tools", function(req, res) {
    res.render("tools");
});


// tools route end here=======================



// Route to log in page============================>>>>>>>>>>>>>>

app.get("/login", function(req, res) {
    res.render("login_page");
});

app.post("/login", passport.authenticate("local", {

    successRedirect: "/",
    failureRedirect: "/login"

}), function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log(user.email);
        }
    });
});

// =============login routes end here======================>>


// Sign up route=============================
app.get("/signup", function(req, res) {
    res.render("sign_up");
});

app.post("/signup", function(req, res) {
    User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function(err, user) {
        if (err) {

            console.log("error has occured from Signup part bro********** ");
            console.log(err);
            res.redirect("/signup");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");
            });
        }
    });
});

// Logout route=========

app.get("/signout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// =============


// Secret page



// Middleware=============

function isloggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
};


// All middlewares end here



// ==========Signup routes end here====================================================








app.listen(3000, function() {
    console.log("Server Started at port 3000");
});
