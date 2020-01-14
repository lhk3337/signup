const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Session = require("express-session");
const flash = require("connect-flash");
var MongoDBStore = require("connect-mongodb-session")(Session);

let url = "mongodb://localhost:27017/dalhav";
mongoose.connect(url, { useNewUrlParser: true });

const indexRouter = require("./routes/index");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.listen(PORT, function() {
  console.log("Exam app listeninig on port", PORT);
});
app.use(flash());

//세션
var store = new MongoDBStore({
  uri: url,
  collection: "sessions"
});

store.on("error", function(error) {
  console.log(error);
});

app.use(
  Session({
    secret: "dalhav",
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: store
  })
);
app.use(passport.initialize());
app.use(passport.session());
