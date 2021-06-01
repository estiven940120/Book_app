"use strict";


const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const path = require("path");
const multer = require("multer");

//DB import
require("./db/database");

//Body parser settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "public/images"),
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });


// app.use(
//   multer({
//     storage,
//     dest: path.join(__dirname, "public/images")
//   }).single("file")
// );

//CORS settings
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/book", bookRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
