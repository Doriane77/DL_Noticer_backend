const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  synopsis: { type: String, required: true },
  director: { type: mongoose.Schema.Types.ObjectId, ref: "Directors" },
  image: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
  types: [{ type: mongoose.Schema.Types.ObjectId, ref: "Types" }],
  adaptation: {
    adapt: { type: Boolean, default: false },
    idBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
      default: null,
    },
  },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actors" }],
});

const Movies = mongoose.model("Movies", moviesSchema);

module.exports = Movies;
