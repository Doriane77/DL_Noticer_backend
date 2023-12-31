const express = require("express");
const router = express.Router();
const controller = require("../Controllers/ReviewsC");
const { register, update, supp, all, one, allUserReviews } = controller;
const { adminAuth } = require("../Middlewares/AdminM");
const { userVerif, verifyToken } = require("../Middlewares/UserM");

router.get("/reviews/one/:id", one);
router.get("/reviews/all", all);
router.get("/reviews/all/user/:userId", allUserReviews);
router.get("/reviews/admin/user/:userId", allUserReviews);
router.post("/reviews/register", verifyToken, register);
router.put("/reviews/update", update);
router.delete("/reviews/sup/:id", supp);

module.exports = router;
