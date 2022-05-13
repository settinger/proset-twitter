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

const {
  loadGame,
  startAGame,
  saveGame,
  isSolution,
  updateGame,
} = require("./gameworks");

// Connect to MongoDB, check if a Game exists in DB
// If a game exists, load it
// If game is already in play, check tweets
// If game is not already in play, initialize a new game

const main = async () => {
  const game1 = await loadGame(6);
  const game2 = await loadGame(7);

  let tweetText = "";
  let replies;
  let game1SolutionFound = false;
  let game2SolutionFound = false;

  if (game1.active || game2.active) {
    // Fetch replies to latest tweet -- I think this actually accepts replies to any tweet actually?
    replies = await client
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

    // Reverse the replies array so oldest entries are first
    replies.reverse();
  }

  if (game1.active) {
    // Check each reply for a solution to game 1; stop if a solution is found
    let game1Solver;
    let game1Solution;
    for (let status of replies) {
      if (isSolution(game1, status.text) && !game1SolutionFound) {
        game1SolutionFound = true;
        game1Solver = status.user.screen_name;
        game1Solution = status.text.toUpperCase().replace(/^@PROSETBOT /, "");
        game1Solution = game1Solution.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove diacritics from bot's tweets
        game1Solution = [...game1Solution].sort().join("");
      }
    }

    if (game1SolutionFound) {
      tweetText += `${game1Solver} found solution ${game1Solution}!`;
      // Deal new cards to field here, announce if game is over
      await updateGame(game1, game1Solution);
      if (game1.deck.length == 0) {
        tweetText += ` The 6-dot deck is empty and the game is over! A new game is starting.`;
        game1.active = false;
      }
    } else {
      tweetText += `No solution found yet for the 6-dot game.`;
    }
  }

  tweetText += "\n\n";

  if (game2.active) {
    // Check each reply for a solution to game 2; stop if a solution is found
    let game2Solver;
    let game2Solution;
    for (let status of replies) {
      if (isSolution(game2, status.text) && !game2SolutionFound) {
        game2SolutionFound = true;
        game2Solver = status.user.screen_name;
        game2Solution = status.text.toUpperCase().replace(/^@PROSETBOT /, "");
        game2Solution = game2Solution.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove diacritics from bot's tweets
        game2Solution = [...game2Solution].sort().join("");
      }
    }

    if (game2SolutionFound) {
      if (game2Solution == "HKNO") {
        tweetText += `${game2Solver} found solution HONK! 🦢🦢`;
      } else if (game2Solution == "IKNO") {
        tweetText += `${game2Solver} found solution OINK! 🐖🐖`;
      } else {
        tweetText += `${game2Solver} found solution ${game2Solution}!`;
      }
      // Deal new cards to field here, announce if game is over
      await updateGame(game2, game2Solution);
      if (game2.deck.length == 0) {
        tweetText += ` The 7-dot deck is empty and the game is over! A new game is starting.`;
        game2.active = false;
      }
    } else {
      tweetText += `No solution found yet for the 7-dot game.`;
    }
  }

  // replies.forEach((status) => {
  //   console.log(status.text);
  //   console.log(status.user.screen_name);
  // });

  // Update games
  // Deactivate game if necessary
  // Start new games if necessary
  if (!game1.active) {
    await startAGame(game1);
  }
  if (!game2.active) {
    await startAGame(game2);
  }

  // tweetText = `A new 6-dot game is starting!\nA new 7-dot game is starting!`;

  // Tweet the updated game contents
  if (game1SolutionFound || game2SolutionFound) {
    let status = {
      status: tweetText,
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

// Eventually, set main() to run at 5-minute intervals
//const run = setInterval(main, 1000 * 60 * 5);
main();
