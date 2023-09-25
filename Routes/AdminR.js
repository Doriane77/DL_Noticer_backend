const express = require("express");
const router = express.Router();
const controller = require("../Controllers/AdminC");
const {
  adminRegister,
  adminUpdate,
  adminSup,
  adminAll,
  adminOne,
  adminSearch,
  adminLogin,
} = controller;
const { adminAuth } = require("../Middlewares/AdminM");
router.get("/admin/one", adminAuth, adminOne);
router.get("/admin/all", adminAuth, adminAll);
router.post("/admin/login", adminLogin);
router.post("/admin/register", adminAuth, adminRegister);
router.put("/admin/update", adminAuth, adminUpdate);
router.delete("/admin/delete", adminAuth, adminSup);
router.get("/admin/search", adminAuth, adminSearch);

module.exports = router;
