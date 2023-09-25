const express = require("express");
const router = express.Router();
const controller = require("../Controllers/UserC");
const { login, register, update, userDelete, onUser, allUser } = controller;
const { userVerif, verifyToken } = require("../Middlewares/UserM");

router.get("/user/one", onUser);
router.get("/user/all", allUser);
router.post("/user/login", login);
router.post("/user/register", userVerif, register);
router.put("/user/update", verifyToken, update);
router.delete("/user/delete", verifyToken, userDelete);

module.exports = router;
