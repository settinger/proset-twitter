const Game = require("./models/game");
const Score = require("./models/score");
const mongoose = require("mongoose");

const twitter = require("twitter");

const _ = require("underscore");

const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "proset-twitter";

const tweetRound = async (game) => {
  // Generate HTML document
  // Convert HTML document to canvas
  // Save canvas as png with twitter's specific image size ratio
  // Tweet image
};
