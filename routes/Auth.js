const express = require("express");
var router = express.Router();
const {
  Auth,
  resetPassword,
  updatePassword,
} = require("../controllers/UsersController");

router.post("/", Auth);
router.post("/reset", resetPassword);
router.post("/update", updatePassword);

module.exports = router;
