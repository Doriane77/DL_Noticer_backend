const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: "Authors" }],
  summary: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
  types: [{ type: mongoose.Schema.Types.ObjectId, ref: "Types" }],
  adaptation: {
    adapt: { type: Boolean, default: false },
    id_movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
      default: null,
    },
  },
});

const Books = mongoose.model("Books", booksSchema);

module.exports = Books;
