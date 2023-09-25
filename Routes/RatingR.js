const express = require("express");
const router = express.Router();
const controller = require("../Controllers/RatingC");
const { register, update, supp, all, one, allUserRating } = controller;
const { adminAuth } = require("../Middlewares/AdminM");
const { userVerif, verifyToken } = require("../Middlewares/UserM");

router.get("/rating/one/:id", verifyToken, one);
router.get("/rating/all/user/:userId", verifyToken, allUserRating);
router.post("/rating/register", verifyToken, register);
router.put("/rating/update", verifyToken, update);

router.delete("/rating/sup/:id", adminAuth, supp);
router.get("/rating/admin/user/:userId", adminAuth, allUserRating);
router.get("/rating/all", adminAuth, all);
module.exports = router;
