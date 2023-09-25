const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  value: { type: Number, required: true, min: 1, max: 5 },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movies" },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Books" },
});

const Ratings = mongoose.model("Ratings", ratingSchema);
module.exports = Ratings;
