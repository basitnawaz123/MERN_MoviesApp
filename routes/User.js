var express = require("express");
var router = express.Router();
const { RegisterUser, verifyUser } = require("../controllers/UsersController");

/* GET users listing. */
router.post("/", RegisterUser);
router.get("/", verifyUser);

module.exports = router;
