var express = require("express");
var router = express.Router();
const multer = require("multer");
const { requiresAuth } = require("express-openid-connect");
const {
  addActor,
  listActors,
  getSpecificActor,
  updateActor,
  importActors,
} = require("../controllers/actorController");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/import", importActors);
router.get("/", listActors);
router.post("/", upload.single("picture"), addActor);
router.get("/:id", getSpecificActor);
router.put("/:id", updateActor);

module.exports = router;
