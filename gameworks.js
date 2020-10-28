const Game = require("./models/game");
const Score = require("./models/score");
const mongoose = require("mongoose");

const _ = require("underscore");

const { tweetRound } = require("./tweetworks");

const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "proset-twitter";

const loadGame = async (level) => {
  await mongoose.connect(`${MONGODB_URI}/${DATABASE_NAME}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  let game = await Game.findOne({ level });

  if (!game) {
    game = new Game({
      active: false,
      level: level,
    });
    await game.save();
  }

  await mongoose.disconnect();
  return game;
};

const startAGame = async (game) => {
  // Set up deck
  game.deck = _.range(1, 2 ** game.level);
  game.deck = _.shuffle(game.deck);

  // Set up playing field
  game.field = [];
  for (let i = 0; i <= game.level; i++) {
    game.field.push(game.deck.pop());
  }

  // Declare game active
  game.active = true;

  // Make image
  const latestTweet = await tweetRound(game);
  game.latestTweet = latestTweet;

  // Save game to mongodb
  await mongoose.connect(`${MONGODB_URI}/${DATABASE_NAME}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  let dbGame = await Game.findOne({ level: game.level });
  dbGame = game;
  await dbGame.save();
  await mongoose.disconnect();
};

module.exports = { startAGame, loadGame };
