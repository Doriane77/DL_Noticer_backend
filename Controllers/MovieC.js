const Movie = require("../Models/MovieM");
const Directors = require("../Models/DirectorM");
const Types = require("../Models/TypeM");
const Books = require("../Models/BookM");
const Actors = require("../Models/ActorM");
const Reviews = require("../Models/ReviewsM");
const Rating = require("../Models/RatingM");

const register = async (req, res) => {
  try {
    const { title, synopsis, director, image, types, adaptation, actors } =
      req.body;

    if (!title || !synopsis || !image) {
      return res
        .status(400)
        .json({ message: "Title, synopsis, et image obligatoire" });
    }

    const movie = new Movie({
      title,
      synopsis,
      director,
      image,
      types,
      adaptation,
      actors,
    });

    const savedMovie = await movie.save();

    if (director) {
      await Directors.findByIdAndUpdate(director, {
        $push: { movies: savedMovie._id },
      });
    }
    if (actors && actors.length) {
      for (let actorId of actors) {
        await Actors.findByIdAndUpdate(actorId, {
          $push: { movies: savedMovie._id },
        });
      }
    }
    if (adaptation && adaptation.idBook) {
      await Books.findByIdAndUpdate(adaptation.id_movie, {
        "adaptation.adapt": true,
        "adaptation.id_movie": savedMovie._id,
      });
    }
    const populatedMovie = await Movie.findById(savedMovie._id)
      .populate("director")
      .populate("types")
      .populate("adaptation.idBook")
      .populate("actors");

    res.status(201).json(populatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const update = async (req, res) => {
  try {
    const movieId = req.body.id;

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, {
      new: true,
    })
      .populate("director")
      .populate("types")
      .populate("adaptation.idBook")
      .populate("actors");

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const supp = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movieToDelete = await Movie.findById(movieId);

    if (!movieToDelete) {
      return res.status(404).json({ message: "Film non trouvé" });
    }
    if (movieToDelete.adaptation.adapt === true) {
      await Books.findByIdAndUpdate(movieToDelete.adaptation.idBook, {
        "adaptation.adapt": false,
        "adaptation.id_movie": null,
      });
    }

    await Reviews.deleteMany({ movie: movieId });
    await Actors.updateMany(
      { movies: movieId },
      { $pull: { movies: movieId } }
    );
    await Directors.updateMany(
      { movies: movieId },
      { $pull: { movies: movieId } }
    );
    await Movie.findByIdAndDelete(movieId);
    res.status(200).json({ message: "Film supprimer avec succèe" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const all = async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate("director")
      .populate("types")
      .populate("actors")
      .populate("adaptation.idBook");

    const invertedData = movies.reverse();
    res.status(200).json(invertedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const one = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId)
      .populate("director")
      .populate("types")
      .populate("actors")
      .populate("reviews")
      .populate("rating")
      .populate("adaptation.idBook");

    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const search = async (req, res) => {
  try {
    const query = req.query.title;
    const movies = await Movie.find({ title: new RegExp(query, "i") })
      .populate("director")
      .populate("types")
      .populate("adaptation.idBook")
      .populate("actors");

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, update, supp, all, one, search };
