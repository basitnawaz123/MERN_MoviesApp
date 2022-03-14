var express = require("express");
var router = express.Router();
const multer = require("multer");
const {
  getMovies,
  addMovie,
  single,
  getMovieByGenre,
  deleteMovie,
  updateMovie,
  calculateBusinessByActor,
  generateCsv,
} = require("../controllers/movieController");
const { requireAuth } = require("../middleware/checkAuth");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/movie_posters");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, "actor_" + Date.now() + "." + extension);
  },
});

var upload = multer({ storage: storage });

router.get("/csv", generateCsv);
router.get("/", getMovies);
router.post("/", upload.single("poster"), addMovie);
router.get("/:id", single);
router.get("/:genre", getMovieByGenre);
router.get("/:calculate", calculateBusinessByActor);
router.put("/:id", upload.single("poster"), updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;
