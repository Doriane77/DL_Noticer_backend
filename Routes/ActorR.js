const express = require("express");
const router = express.Router();
const controller = require("../Controllers/ActorC");
const { register, update, supp, all, one, search } = controller;
const { adminAuth } = require("../Middlewares/AdminM");

router.get("/actor/one/:id", one);
router.get("/actor/all", all);
router.get("/actor/search", search);

router.post("/actor/register", adminAuth, register);
router.put("/actor/update", adminAuth, update);
router.delete("/actor/sup/:id", adminAuth, supp);

module.exports = router;
