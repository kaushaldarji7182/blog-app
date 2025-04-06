const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

//-------------GENERAL CONFIGURATION----------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For JSON payloads like GitHub Webhook
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//---------------------------------------------

//------------PASSPORT CONFIGURATION-----------
const session = require("express-session");

app.use(
  session({
    secret: "I am the best",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Dummy serialize/deserialize if no DB
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware to set current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
//------------------------------------------------

//------------ROUTES------------------------
const indexRoutes = require("./routes/index");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/user");

app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/user", userRoutes);

// --------- GitHub Webhook Route ----------
app.post("/github-webhook", (req, res) => {
  console.log("✅ GitHub Webhook Triggered!");
  console.log("Headers:", req.headers);
  console.log("Payload:", req.body);
  res.status(200).send("Webhook received!");
});
// -----------------------------------------

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

