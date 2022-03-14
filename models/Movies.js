const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter movie name"],
      unique: [true, "Movie name already exists!"],
    },

    genre: {
      type: String,
      required: [true, "Please enter Genre"],
    },

    actors: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "actors",
        },
      },
    ],

    reviews: [
      {
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],

    businessDone: {
      type: Number,
      required: [true, "Please enter Business Done"],
    },

    poster: {
      type: String,
      required: [true, "Movie poster required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = movies = mongoose.model("movies", MovieSchema, "movies");
