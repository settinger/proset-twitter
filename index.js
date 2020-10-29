// Run a Projective Set game over twitter

const dotenv = require("dotenv").config();
const twitter = require("twitter");
const mongoose = require("mongoose");

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const { loadGame, startAGame, saveGame } = require("./gameworks");
const { tweetRound, checkTweets } = require("./tweetworks");

// Connect to MongoDB, check if a Game exists in DB
// If a game exists, load it
// If game is already in play, check tweets
// If game is not already in play, initialize a new game

const main = async () => {
  const game1 = await loadGame(6);
  const game2 = await loadGame(7);

  // Check replies to latest tweet
  const replies = await client
    .get("search/tweets", {
      q: "to:ProsetBot",
      since_id: game1.latestTweet,
      max_results: 100,
    })
    .then((res) => {
      return res.statuses;
    })
    .catch((err) => {
      console.log(err);
    });

  replies.forEach((status) => {
    console.log(status.text);
  });

  // Update games
  // Deactivate game if necessary
  // Start new games if necessary
  if (!game1.active) {
    await startAGame(game1);
  }
  if (!game2.active) {
    await startAGame(game2);
  }

  // Tweet this once, to kick off the bot
  if (false) {
    let status = {
      status: `A new 6-dot game is starting!\nA new 7-dot game is starting!`,
      media_ids: `${game1.latestImage},${game2.latestImage}`,
    };
    client
      .post("statuses/update", status)
      .then((res) => {
        game1.latestTweet = res.id_str;
        game2.latestTweet = res.id_str;
        saveGame(game1);
        saveGame(game2);
      })
      .catch((err) => {
        throw err;
      });
  }
  // Tweet the images with text
};

// Eventually, set main() to run at 45-second intervals
main();
