const Movies = require("../Models/MovieM");
const Books = require("../Models/BookM");
const Types = require("../Models/TypeM");

const register = async (req, res) => {
  try {
    const { type } = req.body;
    const nouveauType = new Types({ type });
    await nouveauType.save();
    res.status(201).json(nouveauType);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};
const update = async (req, res) => {
  try {
    const typeId = req.body.id;
    const typeMisAJour = await Types.findByIdAndUpdate(typeId, req.body, {
      new: true,
    });

    if (!typeMisAJour) {
      return res.status(404).json({ message: "Type non trouvé" });
    }

    res.status(200).json(typeMisAJour);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};
const supp = async (req, res) => {
  try {
    const typeId = req.params.id;
    const typeSupprimé = await Types.findByIdAndDelete(typeId);

    if (!typeSupprimé) {
      return res.status(404).json({ message: "Type non trouvé" });
    }
    await Movies.updateMany({ types: typeId }, { $pull: { types: typeId } });
    await Books.updateMany({ types: typeId }, { $pull: { types: typeId } });
    res.status(200).json({ message: "Type supprimé avec succès" });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};
const all = async (req, res) => {
  try {
    const types = await Types.find();
    res.status(200).json(types);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};
const one = async (req, res) => {
  try {
    const typeId = req.params.id;
    const type = await Types.findById(typeId);
    if (!type) {
      return res.status(404).json({ message: "Type non trouvé" });
    }
    res.status(200).json(type);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};
const search = async (req, res) => {
  try {
    const requête = req.query.title;
    const types = await Types.find({ type: new RegExp(requête, "i") });
    res.status(200).json(types);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = { register, update, supp, all, one, search };
