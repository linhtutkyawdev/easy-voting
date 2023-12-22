var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");
require("dotenv").config();

var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose.set("strictQuery", false)
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://ohmar:mydb004@ac-vnbxbk9-shard-00-00.hjueevu.mongodb.net:27017,ac-vnbxbk9-shard-00-01.hjueevu.mongodb.net:27017,ac-vnbxbk9-shard-00-02.hjueevu.mongodb.net:27017/voting?ssl=true&replicaSet=atlas-gyrvhe-shard-0&authSource=admin&retryWrites=true&w=majority");
var db = mongoose.connection;
db.on("error", console.error.bind("MongoDB connection error "));
db.on("connected", () => console.log("Database connected!"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session
app.use(
  session({
    secret: process.env.sessionKey,
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.admin = req.session.admin;
  res.locals.user = req.session.user;
  next();
});

app.use("/", indexRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
