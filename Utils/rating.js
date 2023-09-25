const Books = require("../Models/BookM");
const Movies = require("../Models/MovieM");

const getAverageRatingForBook = async (req, res) => {
  try {
    const specificBookId = mongoose.Types.ObjectId(req.params.bookId);
    const result = await Books.getAverageRating(specificBookId);
    res.json(result);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération de la note moyenne.");
  }
};
const getAverageRatingForMovie = async (req, res) => {
  try {
    const specificMoviesId = mongoose.Types.ObjectId(req.params.bookId);
    const result = await Movies.getAverageRating(specificMoviesId);
    res.json(result);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération de la note moyenne.");
  }
};
module.exports = { getAverageRatingForBook, getAverageRatingForMovie };
