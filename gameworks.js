const Game = require("./models/game");
const mongoose = require("mongoose");

const _ = require("underscore");

const { tweetRound } = require("./tweetworks");

//const MONGODB_URI = "mongodb://127.0.0.1:27017";
//const DATABASE_NAME = "proset-twitter";

const loadGame = async (level) => {
  //await mongoose.connect(`${MONGODB_URI}/${DATABASE_NAME}`, {
  await mongoose.connect(`${process.env.MONGODB_URI}`, {
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

const saveGame = async (game) => {
  //await mongoose.connect(`${MONGODB_URI}/${DATABASE_NAME}`, {
  await mongoose.connect(`${process.env.MONGODB_URI}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // let dbGame = await Game.findOne({ level: game.level });
  // dbGame.active = game.active;
  // dbGame.field = game.field;
  // dbGame.deck = game.deck;
  // console.log(game.field);
  // console.log(dbGame.field);
  await Game.updateOne({ level: game.level }, game);
  await mongoose.disconnect();
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
  const latestImage = await tweetRound(game);
  game.latestImage = latestImage;

  // Save game to mongodb
  await saveGame(game);
};

// Check if a tweet is a valid potential solution to a game round
const isValid = (soln, letterSet) => {
  // Must be at least three entries long to be valid
  if (soln.length < 3) {
    return false;
  }

  // Must only contain letters from the letterset to be valid
  for (let letter of [...soln]) {
    if (!letterSet.includes(letter)) {
      return false;
    }
  }

  // Must not contain duplicates
  for (let letter of [...soln]) {
    if (soln.indexOf(letter) != soln.lastIndexOf(letter)) {
      return false;
    }
  }

  // If all conditions are met, is valid
  return true;
};

// Check if a tweet contains a valid solution to a game round
const isSolution = (game, tweet) => {
  // First remove the tag
  let soln = tweet.toLowerCase().replace(/^@prosetbot /, "");
  let letterSet;
  if (game.level == 6) {
    letterSet = ["a", "b", "c", "d", "e", "f", "g"];
  } else if (game.level == 7) {
    letterSet = ["h", "i", "j", "k", "l", "m", "n", "o"];
  } else {
    letterSet = ["p", "q", "r", "s", "t", "u", "v", "w", "x"];
  }
  
  // Strip any diacritics from letters
  // I am doing this solely because I think it will be funny to tweet "mjölk" and have it parsed as a valid answer
  soln = soln.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Check that solution consists only of the letterset, no duplicates, and at least three of them
  // If that's the case, find the XOR value of the selected cards together
  if (!isValid(soln, letterSet)) {
    return false;
  }

  let xorVal = 0;
  for (let letter of [...soln]) {
    let index = letterSet.indexOf(letter);
    xorVal ^= game.field[index];
  }
  return xorVal == 0;
};

const updateGame = async (game, soln) => {
  // Convert soln (letters) to indexes and sort them
  let letterSet;
  if (game.level == 6) {
    letterSet = ["a", "b", "c", "d", "e", "f", "g"];
  } else if (game.level == 7) {
    letterSet = ["h", "i", "j", "k", "l", "m", "n", "o"];
  } else {
    letterSet = ["p", "q", "r", "s", "t", "u", "v", "w", "x"];
  }

  let indices = [...soln].map((letter) => {
    return letterSet.indexOf(letter.toLowerCase());
  });
  indices.sort();

  for (let index of indices) {
    if (game.deck.length > 0) {
      game.field[index] = game.deck.pop();
    } else {
      game.field[index] = 0;
    }
  }

  // Make image
  const latestImage = await tweetRound(game);
  game.latestImage = latestImage;

  await saveGame(game);
};

module.exports = { startAGame, loadGame, saveGame, isSolution, updateGame };
