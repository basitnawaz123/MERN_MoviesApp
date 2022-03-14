const MoviesModel = require("../models/Movies");
const json2csv = require("json2csv").parse;
const fs = require("fs");
const mime = require("mime");

const path = require("path");
const { start } = require("repl");

const getMovies = async (req, res) => {
  try {
    let page = req.query.page;
    const limit = 4;
    page = (page - 1) * limit;
    const result = await MoviesModel.find({}).skip(page).limit(limit).lean();

    // console.log(result[0].actors[0]._id.name);
    // res.json(result);
    // return false;

    if (result.length > 0) {
      const count = await MoviesModel.count({});
      const numberOfPages = count / limit;
      res.render("movies", {
        data: result,
        numberOfPages,
        base_url: process.env.Base_url,
      });
    } else {
      res.send("No record found!");
    }
  } catch (error) {
    res.send(error.message);
  }
};

// Add New Movie
const addMovie = async (req, res) => {
  var matches = req.body.poster.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], "base64");
  let decodedImg = response;
  let imageBuffer = decodedImg.data;

  let type = decodedImg.type;

  let ext = mime.getExtension(type);
  let fileName = `poster_${Date.now()}.${ext}`;

  fs.writeFileSync("./uploads/movie_posters/" + fileName, imageBuffer, "utf8");

  const { name, genre, businessDone, actors, reviews } = req.body;

  const movieData = new MoviesModel({
    name,
    genre,
    actors,
    reviews,
    businessDone,
    poster: req.body.poster,
  });

  try {
    await movieData.save();
    res.send("Movie added successfully!");
  } catch (error) {
    res.send(error.message);
  }
};

// Fetching Single Movie Record
const single = async (req, res) => {
  const _id = req.params.id;
  const result = await MoviesModel.findById({ _id }).lean().populate({
    path: "actors._id",
    select: "name age gender",
  });

  res.render("single_movie", { result });
};

// Fetching single movie by Genre
const getMovieByGenre = async (req, res) => {
  const genre = req.params.genre;
  try {
    const result = await MoviesModel.find({ genre });
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.send("No record found!");
    }
  } catch (error) {
    res.send(error.message);
  }
};

// Deleting movie record
const deleteMovie = async (req, res) => {
  const _id = req.params.id;

  try {
    await MoviesModel.findByIdAndDelete({ _id });

    res.send("Record deleted successfully");
  } catch (error) {
    res.send(error.message);
  }
};

// Calculating movie Business amount by actor
const calculateBusinessByActor = async (req, res) => {
  _id = req.params.id;
  try {
    const sum = await MoviesModel.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$actors._id",
          total: {
            $sum: "$businessDone",
          },
        },
      },
    ]);
    res.json(sum);
  } catch (error) {
    res.send(error.message);
  }
};

// Updating Movie

const updateMovie = async (req, res) => {
  _id = req.params.id;
  const { reviews } = req.body;

  try {
    await MoviesModel.findOneAndUpdate(
      { _id },
      {
        $push: {
          reviews,
        },
      }
    );
    res.status(200).send("Movie Updated Successfully!");
  } catch (error) {
    res.send(error.message);
  }
};

const generateCsv = async (req, res) => {
  const data = await MoviesModel.find().populate({
    path: "actors._id",
    select: "name age gender",
  });

  const fields = ["_id", "name", "genre", "actors", "businessDone"];
  var filePath = "./uploads/exports/" + Date.now() + ".csv";

  try {
    csv = json2csv(data, { fields });
    fs.writeFile(filePath, csv, function (err) {
      if (err) {
        res.send(err.message);
      } else {
        console.log("CSV generated");
        res.setHeader("Content-disposition", "attachment; filename=data.csv");
        res.set("Content-Type", "text/csv");
        res.status(200).send(csv);
      }
    });

    res.download(filePath, "GeneratedCsV.csv");
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  addMovie,
  getMovies,
  single,
  getMovieByGenre,
  deleteMovie,
  updateMovie,
  calculateBusinessByActor,
  generateCsv,
};
