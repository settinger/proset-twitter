// Run a Projective Set game over twitter

const dotenv = require("dotenv").config();
const twitter = require("twitter");
const mongoose = require("mongoose");

const { loadGame, startAGame } = require("./gameworks");

// TODO: check the latest "const client = new twitter()" syntax

// Connect to MongoDB, check if a Game exists in DB
// If a game exists, load it
// If game is already in play, check tweets
// If game is not already in play, initialize a new game

const main = async () => {
  const currGame = await loadGame();
  if (currGame.active) {
    // check tweets
  } else {
    startAGame(currGame);
  }
};

main();
