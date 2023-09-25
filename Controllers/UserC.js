const dotenv = require("dotenv");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const User = require("../Models/UserM");

const allUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (!users) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const onUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utillisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const register = async (req, res) => {
  try {
    const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().min(0),
      password: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) return res.status(400).send(result.error);
    const { username, email, password } = req.body;

    const user = new User({
      username: username,
      email: email,
      password: password,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log("Utilisateur enregistré avec succès ");
    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;
    if (email) {
      user = await User.findOne({ email: email });
    }

    if (!user) {
      return res.status(404).json({ message: "Invalid Email" });
    }
    const verifPassword = await bcrypt.compare(password, user.password);
    if (!verifPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Connecter avec succès",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const update = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const Vusername = await User.findOne({ username: req.body.username });
    const Vemail = await User.findOne({ email: req.body.email });

    const userId = req.user.userId;
    let userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: "Utillisateur non trouvé" });
    }

    if (username && !Vusername) userToUpdate.username = username;
    if (email && !Vemail) userToUpdate.email = email;
    if (password) userToUpdate.password = password;
    let messages = "Utilisateur modifié avec succès";
    if (Vusername) messages = "Nom d'utilisateur déjà utilisé";
    if (Vemail) messages = "Email déjà utilisé";
    if (Vemail && Vusername)
      messages = "Nom d'utilisateur et email déjà utilisés";

    await userToUpdate.save();
    res.status(200).json({
      message: messages,
      user: {
        id: userToUpdate._id,
        username: userToUpdate.username,
        email: userToUpdate.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const userDelete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userToDelete = await User.findByIdAndDelete(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "Utillisateur non trouvé" });
    }

    res.status(200).json({ message: "Utillisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, update, userDelete, onUser, allUser };
