const mongoose = require("mongoose");

const ActorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    picture: {
      type: String,
      required: [true, "please upload actor profile picture"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = actors = mongoose.model("actors", ActorSchema, "actors");
