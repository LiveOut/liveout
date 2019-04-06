"use strict";
const mongoose = require("mongoose");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri = require("./config/keys").mongoURI;
const client = new MongoClient(uri, { useNewUrlParser: true });

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.error(err));

app.get("/", (req, res) => res.send("Hello World"));

//init routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
