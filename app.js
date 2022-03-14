const express = require("express");
const connectDB = require("./config/db");
const bp = require("body-parser");
const app = express();
const path = require("path");
require("dotenv").config();
const exphbs = require("express-handlebars");
const { auth } = require("express-openid-connect");
const { config } = require("./config/auth0");
var router = express.Router();

var Handlebars = require("handlebars");
var paginate = require("handlebars-paginate");

Handlebars.registerHelper("paginate", paginate);

app.use(express.static(__dirname + "/public"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

connectDB();

// Server connection
app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});

// Auth0
app.use(auth(config));

// Handlebars setting

app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutDir: __dirname + "views/layouts",
    partialsDir: [path.join(__dirname, "views/partials")],

    // custom helper
    helpers: {
      counter: (index) => index + 1,
    },
  })
);

app.get("/", (req, res) => {
  res.render("main", { loggedIn: req.oidc.isAuthenticated() ? 1 : 0 });
});

app.use("/uploads", express.static("uploads"));
router.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "etsa2/build", "index.html"));
});

const mime = require("mime");

// parse application/x-www-form-urlencoded

app.use(bp.json({ limit: "50mb" }));
app.use(
  bp.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);


// parse application/json
app.use(bp.json());

// Registering Routes from route folder
var userRouter = require("./routes/User");
var authRouter = require("./routes/Auth");
var actorRouter = require("./routes/Actor");
var movieRouter = require("./routes/Movie");

app.use("/register", userRouter);
app.use("/auth", authRouter);
app.use("/actors", actorRouter);
app.use("/movies", movieRouter);
