const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const saltRounds = 10;

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "takako",
    password: "",
    database: "smart-brain"
  }
});

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

//signin-----------------------
app.post("/signin", signin.handleSignin(db, bcrypt));

//register--------------------
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt, saltRounds);
});

//profile/:id------------------
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//image--------------------------
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

//image_api
app.post("/imageUrl", (req, res) => {
  image.handleApiCall(req, res);
});

//listen-----------------------
app.listen(3000, () => {
  console.log("app is running on port 3000");
});
