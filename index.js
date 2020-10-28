// Run a Projective Set game over twitter

const dotenv = require("dotenv").config();
const twitter = require("twitter");
const mongoose = require("mongoose");

const { loadGame, startAGame } = require("./gameworks");
const { tweetRound, checkTweets } = require("./tweetworks");

// TODO: check the latest "const client = new twitter()" syntax

// Connect to MongoDB, check if a Game exists in DB
// If a game exists, load it
// If game is already in play, check tweets
// If game is not already in play, initialize a new game

const main = async () => {
  const game1 = await loadGame(6);
  const game2 = await loadGame(7);
  if (!game1.active) {
    await startAGame(game1);
  }
  if (!game2.active) {
    await startAGame(game2);
  }
};

// Eventually, set main() to run at 45-second intervals
main();
