const Actor = require("../Models/ActorM");
const Movies = require("../Models/MovieM");

const register = async (req, res) => {
  try {
    const { name, surname, image, movies } = req.body;

    if (!name || !surname) {
      return res
        .status(400)
        .json({ message: "Le nom et le prénom sont obligatoires" });
    }

    const actor = new Actor({
      name: name,
      surname: surname,
      image: image,
      movies: movies,
    });

    const savedActor = await actor.save();

    const populatedActor = await Actor.findById(savedActor._id).populate(
      "movies"
    );
    if (movies && movies.length > 0) {
      for (let movieId of movies) {
        await Movies.findByIdAndUpdate(movieId, {
          $addToSet: { actors: savedActor._id },
        });
      }
    }
    res.status(201).json(populatedActor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const update = async (req, res) => {
  try {
    const actorId = req.body.id;

    const updatedActor = await Actor.findByIdAndUpdate(actorId, req.body, {
      new: true,
    }).populate("movies");

    if (!updatedActor) {
      return res.status(404).json({ message: "Acteur non trouvé" });
    }
    for (let prevMovieId of previousActor.movies) {
      if (!req.body.movies.includes(prevMovieId.toString())) {
        await Movies.findByIdAndUpdate(prevMovieId, {
          $pull: { actors: actorId },
        });
      }
    }
    for (let newMovieId of req.body.movies) {
      if (!previousActor.movies.includes(newMovieId.toString())) {
        await Movies.findByIdAndUpdate(newMovieId, {
          $addToSet: { actors: actorId },
        });
      }
    }
    res.status(200).json(updatedActor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const supp = async (req, res) => {
  try {
    const actorId = req.params.id;
    const deletedActor = await Actor.findByIdAndDelete(actorId);

    if (!deletedActor) {
      return res.status(404).json({ message: "Acteur non trouvé" });
    }
    await Movies.updateMany(
      { actors: actorId },
      { $pull: { actors: actorId } }
    );
    res.status(200).json({ message: "Acteur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const all = async (req, res) => {
  try {
    const actors = await Actor.find({}).populate("movies");
    const invertedData = actors.reverse();
    res.status(200).json(invertedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const one = async (req, res) => {
  try {
    const actorId = req.params.id;
    const actor = await Actor.findById(actorId).populate("movies");

    if (!actor) {
      return res.status(404).json({ message: "Acteur non trouvé" });
    }
    res.status(200).json(actor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const search = async (req, res) => {
  try {
    const query = req.query.name;
    const actors = await Actor.find({
      $or: [
        { name: new RegExp(query, "i") },
        { surname: new RegExp(query, "i") },
      ],
    });
    res.status(200).json(actors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, update, supp, all, one, search };
