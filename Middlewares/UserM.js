const Joi = require("joi");
const User = require("../Models/UserM");
const jwt = require("jsonwebtoken");

const userVerif = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().min(0),
    password: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) return res.status(400).send(result.error);
  const username = await User.findOne({ username: req.body.username });
  const email = await User.findOne({ email: req.body.email });
  if (username || email) {
    return res.status(400).send({
      message: "Ce nom d'utilisateur ou cette adresse email est déja utiliser.",
    });
  }
  next();
};

const verifyToken = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token)
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(403)
        .json({ message: "Accès refusé. Vous n'êtes pas admin." });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { userVerif, verifyToken };
