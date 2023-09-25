const express = require("express");
const router = express.Router();
const controller = require("../Controllers/MovieC");
const { register, update, supp, all, one, search } = controller;
const { adminAuth } = require("../Middlewares/AdminM");

router.get("/movie/one/:id", one);
router.get("/movie/all", all);
router.get("/movie/search", search);
// router.post("/movie/register", adminAuth, register);
// router.put("/movie/update", adminAuth, update);
// router.delete("/movie/sup/:id", adminAuth, supp);
router.post("/movie/register", register);
router.put("/movie/update", update);
router.delete("/movie/sup/:id", supp);

module.exports = router;
