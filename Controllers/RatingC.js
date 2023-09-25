const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");
const Movie = require("../Models/MovieM");
const Books = require("../Models/BookM");
const User = require("../Models/UserM");
const Ratings = require("../Models/RatingM");

const register = async (req, res) => {
  try {
    const { user, movie, book, value } = req.body;

    if (!user || (!movie && !book) || (movie && book) || !value) {
      return res
        .status(400)
        .json({ message: "Données manquantes ou invaluserIdes" });
    }
    if (value <= 0 || value > 5)
      return res
        .status(400)
        .json({ message: "La note doit être entre 1 et 5" });

    let existingRating;
    if (movie) existingRating = await Ratings.findOne({ user, movie });
    if (book) existingRating = await Ratings.findOne({ user, book });

    if (existingRating) {
      return res
        .status(400)
        .json({ message: "Vous avez déjà noté ce film/livre" });
    }
    let newRating;
    if (movie) newRating = new Ratings({ user, value, movie });
    if (book) newRating = new Ratings({ user, value, book });
    await newRating.save();
    await User.findByIdAndUpdate(user, { $push: { notes: newRating._id } });

    if (movie) {
      const aggregate = await Ratings.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movie) } },
        { $group: { _id: null, avgRating: { $avg: "$value" } } },
      ]);
      let newAvgRating = aggregate[0]?.avgRating || 0;
      newAvgRating = parseFloat(newAvgRating.toFixed(1));
      await Movie.findByIdAndUpdate(movie, { rating: newAvgRating });
    } else if (book) {
      const aggregate = await Ratings.aggregate([
        { $match: { book: new mongoose.Types.ObjectId(book) } },
        { $group: { _id: null, avgRating: { $avg: "$value" } } },
      ]);
      let newAvgRating = aggregate[0]?.avgRating || 0;
      newAvgRating = parseFloat(newAvgRating.toFixed(1));
      await Books.findByIdAndUpdate(book, { rating: newAvgRating });
    }

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const all = async (req, res) => {
  try {
    const ratings = await Ratings.find()
      .populate("user", "-password -email")
      .populate("movie")
      .populate("book");

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const one = async (req, res) => {
  try {
    const { reatingId } = req.params;
    const rating = await Ratings.findById(reatingId)
      .populate("user", "-password  -email")
      .populate("movie")
      .populate("book");

    if (!rating) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const allUserRating = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Ratings.find({ user: userId })
      .populate("movie")
      .populate("book");
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const update = async (req, res) => {
  try {
    const { ratingId, value, movie, book } = req.body;

    if (!ratingId || !value || (!movie && !book)) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    if (value <= 0 || value > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être entre 1 et 5" });
    }

    const updatedRating = await Ratings.findByIdAndUpdate(
      ratingId,
      { value },
      { new: true }
    );
    if (!updatedRating) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }

    if (movie) {
      const aggregate = await Ratings.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movie) } },
        { $group: { _id: null, avgRating: { $avg: "$value" } } },
      ]);
      let newAvgRating = aggregate[0]?.avgRating || 0;
      newAvgRating = parseFloat(newAvgRating.toFixed(1));
      await Movie.findByIdAndUpdate(movie, { rating: newAvgRating });
    } else if (book) {
      const aggregate = await Ratings.aggregate([
        { $match: { book: new mongoose.Types.ObjectId(book) } },
        { $group: { _id: null, avgRating: { $avg: "$value" } } },
      ]);
      let newAvgRating = aggregate[0]?.avgRating || 0;
      newAvgRating = parseFloat(newAvgRating.toFixed(1));
      await Books.findByIdAndUpdate(book, { rating: newAvgRating });
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const supp = async (req, res) => {
  try {
    const { ratingId } = req.params;

    const deletedRating = await Ratings.findByIdAndDelete(ratingId);
    if (!deletedRating) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }

    res.status(200).json({ message: "Évaluation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, update, supp, all, one, allUserRating };
