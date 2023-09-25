const Movies = require("../Models/MovieM");
const Directors = require("../Models/DirectorM");

const register = async (req, res) => {
  try {
    const { director, image, movies } = req.body;

    if (!director) {
      return res
        .status(400)
        .json({ message: "Le nom du directeur est obligatoire" });
    }

    const newDirector = new Directors({
      director,
      image,
      movies,
    });

    const savedDirector = await newDirector.save();
    if (movies && movies.length > 0) {
      for (let movieId of movies) {
        await Movies.findByIdAndUpdate(movieId, {
          $set: { director: savedDirector._id },
        });
      }
    }
    res.status(201).json(savedDirector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const update = async (req, res) => {
  try {
    const directorId = req.body.id;
    const previousDirector = await Directors.findById(directorId);

    if (!previousDirector) {
      return res.status(404).json({ message: "Directeur non trouvé" });
    }

    const updatedDirector = await Directors.findByIdAndUpdate(
      directorId,
      req.body,
      {
        new: true,
      }
    ).populate("movies");

    for (let prevMovieId of previousDirector.movies) {
      if (!req.body.movies.includes(prevMovieId.toString())) {
        await Movies.findByIdAndUpdate(prevMovieId, {
          $set: { director: null },
        });
      }
    }
    for (let newMovieId of req.body.movies) {
      if (!previousDirector.movies.includes(newMovieId.toString())) {
        await Movies.findByIdAndUpdate(newMovieId, {
          $set: { director: directorId },
        });
      }
    }

    res.status(200).json(updatedDirector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const supp = async (req, res) => {
  try {
    const directorId = req.params.id;
    const deletedDirector = await Directors.findByIdAndDelete(directorId);

    if (!deletedDirector) {
      return res.status(404).json({ message: "Directeur non trouvé" });
    }
    if (deletedDirector.movies && deletedDirector.movies.length > 0) {
      for (let movieId of deletedDirector.movies) {
        await Movies.findByIdAndUpdate(movieId, {
          $set: { director: null },
        });
      }
    }
    res.status(200).json({ message: "Directeur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const all = async (req, res) => {
  try {
    const directors = await Directors.find().populate("movies");
    const invertedData = directors.reverse();
    res.status(200).json(invertedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const one = async (req, res) => {
  try {
    const directorId = req.params.id;
    const director = await Directors.findById(directorId).populate("movies");

    if (!director) {
      return res.status(404).json({ message: "Directeur non trouvé" });
    }

    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const search = async (req, res) => {
  try {
    const query = req.query.director;
    const directors = await Directors.find({
      director: new RegExp(query, "i"),
    }).populate("movies");

    res.status(200).json(directors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, update, supp, all, one, search };
