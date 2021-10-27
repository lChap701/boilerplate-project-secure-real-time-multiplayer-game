require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const nanoid = require("nanoid").nanoid;

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const Collectible = require("./public/Collectible.mjs");
const gameConfig = require("./public/gameConfig.mjs");
const startPos = require("./public/utils/startPos.mjs");

/**
 * Module that contains the entire application
 * @module ./server
 *
 */
const app = express();

// Socket.io Setup
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Helmet setup
const helmet = require("helmet");
app.use(
  helmet({
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: {
      setTo: "PHP 7.4.3",
    },
  })
);

// Prevents caching
const nocache = require("nocache");
app.use(nocache());

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

// Array containing all players
let connectedPlayers = [];

// Sets up the collectible
let collectible = gameConfig.selectCollectible;
let pos = startPos(gameConfig.gameSize, collectible);
let item = new Collectible({
  x: pos.x,
  y: pos.y,
  src: collectible.src,
  value: collectible.points,
  id: nanoid(),
});

// Creates listeners for all sockets
io.on("connection", (socket) => {
  // Removes the player who left the game from the array of players
  socket.on("disconnect", () => {
    connectedPlayers = connectedPlayers.filter(
      (player) => player.id !== socket.id
    );
    socket.broadcast.emit("opponentLeft", socket.id);
    console.log("A player left the game");
  });

  // Adds players and items to the game
  socket.on("joinGame", (player) => {
    connectedPlayers.push(player);
    console.log("A new player joined the game");

    // Send collectible to client
    socket.emit("setCollectible", item);

    // Adds opponents to the game
    io.sockets.emit("getOpponents", connectedPlayers);

    // Sends the correct rank to all clients
    socket.on("requestRank", () => {
      console.log(connectedPlayers.length);
      io.sockets.emit("getRank", connectedPlayers);
    });

    // Moves the player across all sockets
    socket.on("movePlayer", (player) => {
      let index = connectedPlayers.findIndex((p) => p.id == player.id);
      connectedPlayers[index].dir = player.dir;
      connectedPlayers[index].x = player.x;
      connectedPlayers[index].y = player.y;
      socket.broadcast.emit("updateOpponent", player);
    });

    // Updates the players score and creates a new collectible
    socket.on("playerCollideWithCollectible", () => {
      socket.emit("updateScore", item.value);

      // Get a new collectible sprite
      collectible = gameConfig.selectCollectible;
      while (collectible.src == item.src) {
        collectible = gameConfig.selectCollectible;
      }

      // Get a new starting position
      pos = startPos(gameConfig.gameSize, collectible);
      while (pos.x == item.x && pos.y == item.y) {
        pos = startPos(gameConfig.gameSize, collectible);
      }

      // Send collectible to all clients
      item = new Collectible({
        x: pos.x,
        y: pos.y,
        src: collectible.src,
        value: collectible.points,
        id: nanoid(),
      });
      io.sockets.emit("setCollectible", item);
    });

    // Updates a player's score for all clients
    socket.on("scored", (player) => {
      let index = connectedPlayers.findIndex((p) => p.id == player.id);
      connectedPlayers[index].score = player.score;
      io.sockets.emit("getRank", connectedPlayers);
      socket.broadcast.emit("updateOpponent", player);
      console.log(player.score);

      // Ends the game once a player has a score of at least 500 points
      if (player.score >= 500) {
        socket.emit("winner");
        socket.broadcast.emit("loser");
      }
    });
  });
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
