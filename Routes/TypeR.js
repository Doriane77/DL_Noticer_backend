const express = require("express");
const router = express.Router();
const controller = require("../Controllers/TypeC");
const { register, update, supp, all, one, search } = controller;
const { adminAuth } = require("../Middlewares/AdminM");

router.get("/type/one/:id", one);
router.get("/type/all", all);
router.get("/type/search", search);

router.post("/type/register", adminAuth, register);
router.put("/type/update", adminAuth, update);
router.delete("/type/sup/:id", adminAuth, supp);

module.exports = router;
