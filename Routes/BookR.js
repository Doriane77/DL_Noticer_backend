const express = require("express");
const router = express.Router();
const controller = require("../Controllers/BookC");
const { register, update, supp, all, one, search } = controller;
const { adminAuth } = require("../Middlewares/AdminM");

router.get("/book/one/:id", one);
router.get("/book/all", all);
router.get("/book/search", search);

router.post("/book/register", adminAuth, register);
router.put("/book/update", adminAuth, update);
router.delete("/book/sup/:id", adminAuth, supp);

module.exports = router;
