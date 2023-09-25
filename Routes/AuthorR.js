const express = require("express");
const router = express.Router();
const controller = require("../Controllers/AuthorC");
const { register, update, supp, all, one, search, getAuthorMovies } =
  controller;
const { adminAuth } = require("../Middlewares/AdminM");

router.get("/author/one/:id", one);
router.get("/author/all", all);
router.get("/author/search", search);
router.get("/author/:id/all/books", getAuthorMovies);
router.post("/author/register", adminAuth, register);
router.put("/author/update", adminAuth, update);
router.delete("/author/sup/:id", adminAuth, supp);

module.exports = router;
