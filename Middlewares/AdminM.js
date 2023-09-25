const Admin = require("../Models/AdminM");
const jwt = require("jsonwebtoken");
const adminAuth = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token)
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    const admin = await Admin.findById(req.user.adminId);

    if (!admin) {
      return res
        .status(403)
        .json({ message: "Accès refusé. Vous n'êtes pas admin." });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = { adminAuth };
