const mongoose = require("mongoose");

const directorsSchema = new mongoose.Schema({
  director: {
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

const Directors = mongoose.model("Directors", directorsSchema);

module.exports = Directors;
