var express = require("express");
var router = express.Router();
const multer = require("multer");
const { requireAuth } = require("../middleware/checkAuth");
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
router.get("/", requireAuth, listActors);
router.post("/", upload.single("picture"), addActor);
router.get("/:id", requireAuth, getSpecificActor);
router.put("/:id", updateActor);

module.exports = router;
