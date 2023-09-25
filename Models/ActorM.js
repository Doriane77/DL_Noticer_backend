const mongoose = require("mongoose");

const actorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
    },
  ],
});

const Actors = mongoose.model("Actors", actorsSchema);

module.exports = Actors;
