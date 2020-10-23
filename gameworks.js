const Game = require("./models/game");
const Score = require("./models/score");
const mongoose = require("mongoose");

const _ = require("underscore");

const MONGODB_URI = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "proset-twitter";

const loadGame = async () => {
  let currentGame = new Game();
  await mongoose.connect(`${MONGODB_URI}/${DATABASE_NAME}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const games = await Game.find({});
  let newGame;
  if (games.length == 0) {
    newGame = new Game({
      active: false,
      level: 0,
      deck: [],
      field: [],
    });
    await newGame.save();
  } else {
    newGame = games[0];
  }
  await mongoose.disconnect();
  return newGame;
};

const startAGame = async (game) => {
  // Increment level from last game
  game.level++;

  // Set up deck
  let n = game.level < 4 ? 6 : 7;
  game.deck = _.range(1, 1 + 2 ** n);
  game.deck = _.shuffle(game.deck);

  // Set up playing field
  game.field = [];
  for (let i = 0; i < n + 1; i++) {
    game.field.push(game.deck.pop());
  }

  // Make image and tweet it
  await tweetRound(game);

  // Declare game active
  game.active = true;

  // Save game to mongodb
  await mongoose.connect(`${MONGODB_URI}/${DATABASE_NAME}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  let dbGames = await Game.find({});
  dbGames[0] = game;
  await dbGames[0].save();
  await mongoose.disconnect();
};

module.exports = { startAGame, loadGame };
