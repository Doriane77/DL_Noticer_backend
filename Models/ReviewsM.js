const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema({
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movies" },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Books" },
  date: {
    type: {
      day: Number,
      month: Number,
      year: Number,
      time: Number,
      minute: Number,
      second: Number,
    },
    default: () => {
      const now = new Date();
      return {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        time: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      };
    },
  },
});

const Reviews = mongoose.model("Reviews", reviewsSchema);

module.exports = Reviews;
