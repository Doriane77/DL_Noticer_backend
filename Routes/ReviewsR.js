const express = require("express");
const router = express.Router();
const controller = require("../Controllers/RatingC");
const { register, update, supp, all, one, allUserRating } = controller;
const { adminAuth } = require("../Middlewares/AdminM");
const { userVerif, verifyToken } = require("../Middlewares/UserM");

router.get("/reviews/one/:id", one);
router.get("/reviews/all", all);
router.get("/reviews/all/user/:userId", allUserRating);
router.get("/reviews/admin/user/:userId", allUserRating);
router.post("/reviews/register", register);
router.put("/reviews/update", update);
router.delete("/reviews/sup/:id", supp);

module.exports = router;
