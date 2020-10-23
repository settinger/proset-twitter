// Mongoose model for current game

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  active: {
    type: Boolean,
  },
  level: {
    type: Number,
  },
  deck: {
    type: [Number],
  },
  field: {
    type: [Number],
  },
});

const Game = mongoose.model("Game", schema);
module.exports = Game;
