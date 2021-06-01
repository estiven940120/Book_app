"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = Schema({
  name: String,
  author: String, 
  genre: {
    type: String,
    enum: [
      "Narrativo",
      "Lírico",
      "Drama",
      "Poesía",
      "Ensayo",
      "Fantasía", 
      "Ciencia Ficción", 
      "Novela"
    ],
  },
  pages: { type: Number, default: 0 },
  publisher: String,
  synopsis: String,
  cover_url: { type: String, default: ""},
  createdon: { type: Date, default: Date.now() },
  createdby: { type: String, default: "NN" },
  lastmodified: { type: Date, default: "" },
});

module.exports = mongoose.model("Book", BookSchema);
