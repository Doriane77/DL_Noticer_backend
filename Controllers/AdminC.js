const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// const Movie = require("../Models/MovieM");
// const Directors = require("../Models/DirectorM");
// const Types = require("../Models/TypeM");
// const Books = require("../Models/BookM");
// const Actors = require("../Models/ActorM");
// const Reviews = require("../Models/ReviewsM");
// const Rating = require("../Models/RatingM");
const Admin = require("../Models/AdminM");
const User = require("../Models/UserM");

const adminRegister = async (req, res) => {
  try {
    const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().min(0),
      password: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) return res.status(400).send(result.error);
    const { username, email, password } = req.body;
    const newAdmin = new Admin({
      username,
      email,
      password,
    });

    const savedAdmin = await newAdmin.save();
    const token = jwt.sign(
      { adminId: savedAdmin._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    console.log("Admin enregistré avec succès ");
    res.status(201).json({
      message: "Admin enregistré avec succès",
      token: token,
      admin: {
        id: savedAdmin._id,
        username: savedAdmin.username,
        email: savedAdmin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const adminUpdate = async (req, res) => {
  try {
    const { id, username, email, password } = req.body;

    if (req.user.adminId !== id)
      return res.status(403).json({ message: "Action non autorisée." });

    const VadminUsername = await Admin.findOne({ username: username });
    const VadminEmail = await Admin.findOne({ email: email });

    const adminUpdate = await Admin.findById(req.user.adminId);

    if (!adminUpdate)
      return res.status(404).json({ message: "Admin non trouvé" });
    if (username && !VadminUsername) adminUpdate.username = username;
    if (email && !VadminEmail) adminUpdate.email = email;
    if (password) adminUpdate.password = password;

    let messages = "Admin modifié avec succès";

    if (VadminUsername) messages = "Nom d'utilisateur déja utilisé";
    if (VadminEmail) messages = "Email déja utilisé";
    if (VadminEmail && VadminUsername)
      messages = "Nom d'utilisateur et email déja utilisé";

    await adminUpdate.save();

    res.status(200).json({
      message: messages,
      admin: {
        id: adminUpdate._id,
        username: adminUpdate.username,
        email: adminUpdate.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const adminSup = async (req, res) => {
  try {
    const { id } = req.body;

    if (req.user.adminId !== id)
      return res.status(403).json({ message: "Action non autorisée." });

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }
    res.status(200).json({ message: "Admin supprimer avec succèe" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const adminAll = async (req, res) => {
  try {
    const admins = await Admin.find({}).select("-password");
    const invertedData = admins.reverse();
    res.status(200).json(invertedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const adminOne = async (req, res) => {
  try {
    const { id } = req.body;
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const adminSearch = async (req, res) => {
  try {
    const { username, email } = req.body;

    const searchCriteria = [];

    if (username) {
      searchCriteria.push({ username: new RegExp(username, "i") });
    }

    if (email) {
      searchCriteria.push({ email: new RegExp(email, "i") });
    }

    const admins = await Admin.find(
      searchCriteria.length > 0 ? { $or: searchCriteria } : {}
    ).select("-password");

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Connecter avec succès",
      token: token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminRegister,
  adminUpdate,
  adminSup,
  adminAll,
  adminOne,
  adminSearch,
  adminLogin,
};
