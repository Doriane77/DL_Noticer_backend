const express = require("express");
const router = express.Router();
const controller = require("../Controllers/DirectorC");
const { register, update, supp, all, one, search } = controller;
const { adminAuth } = require("../Middlewares/AdminM");

router.get("/director/one/:id", one);
router.get("/director/all", all);
router.get("/director/search", search);

router.post("/director/register", adminAuth, register);
router.put("/director/update", adminAuth, update);
router.delete("/director/sup/:id", adminAuth, supp);

module.exports = router;
