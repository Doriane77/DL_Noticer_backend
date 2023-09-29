const Movies = require("../Models/MovieM");
const Users = require("../Models/UserM");
const Books = require("../Models/BookM");
const Reviews = require("../Models/ReviewsM");

const register = async (req, res) => {
  try {
    const { message, user, book, movie } = req.body;
    if (!message || !user || (!book && !movie)) {
      return res.status(400).json({
        message:
          "Veuillez fournir un message, un utilisateur et soit un livre ou un film.",
      });
    }
    const review = new Reviews(req.body);
    await review.save();

    if (movie) {
      const movieToUpdate = await Movies.findById(movie);
      if (!movieToUpdate) {
        return res.status(404).json({ message: "Movie not found" });
      }

      movieToUpdate.reviews.push(review._id);
      await movieToUpdate.save();
    }
    if (book) {
      const bookToUpdate = await Books.findById(book);
      if (!bookToUpdate) {
        return res.status(404).json({ message: "Book not found" });
      }

      bookToUpdate.reviews.push(review._id);
      await bookToUpdate.save();
    }
    res
      .status(201)
      .json({ message: "Commentaire créer avec succès", review: review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const reviewId = req.body.id;
    const updatedReview = await Reviews.findByIdAndUpdate(reviewId, req.body, {
      new: true,
    });
    if (!updatedReview) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const supp = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const deletedReview = await Reviews.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    await Books.updateMany({}, { $pull: { reviews: reviewId } });
    await Movies.updateMany({}, { $pull: { reviews: reviewId } });

    res.status(200).json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const all = async (req, res) => {
  try {
    const reviews = await Reviews.find()
      .populate("user")
      .populate("movie")
      .populate("book");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const one = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Reviews.findById(reviewId)
      .populate("user")
      .populate("movie")
      .populate("book");
    if (!review) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userReviews = await Reviews.find({ user: userId })
      .populate("movie")
      .populate("book");
    if (!userReviews.length) {
      return res
        .status(404)
        .json({ message: "Aucun avis trouvé pour cet utilisateur" });
    }
    res.status(200).json(userReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, update, supp, all, one, allUserReviews };
