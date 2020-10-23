// Mongoose model for current game

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Score = mongoose.model("Score", schema);
module.exports = Score;
