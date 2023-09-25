const mongoose = require("mongoose");

const authorsSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
    },
  ],
});

const Authors = mongoose.model("Authors", authorsSchema);

module.exports = Authors;
