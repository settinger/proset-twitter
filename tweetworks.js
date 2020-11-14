require("dotenv").config();

const Game = require("./models/game");
const mongoose = require("mongoose");

const twitter = require("twitter");
const _ = require("underscore");

const { drawField } = require("./canvasworks");
const { createCanvas } = require("canvas");

const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "proset-twitter";

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const tweetRound = async (game) => {
  const canvas = createCanvas(590, 675);
  drawField(canvas, game);
  let media_data = canvas
    .toDataURL()
    .replace(/^data:image\/(png|jpg);base64,/, "");

  // Upload image using twitter API, get media ID
  let latestImage = client
    .post("media/upload", { media_data })
    .then((media) => {
      // console.log(media.media_id_string);
      game.latestImage = media.media_id_string;
      return media.media_id_string;
    })
    .catch((err) => {
      throw err;
    });

  return latestImage;
};

const checkTweets = async (game) => {};

module.exports = { tweetRound, checkTweets };
