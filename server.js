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

// Gets a collectible
const collectible = gameConfig.selectCollectible;
const pos = startPos(gameConfig.gameSize, collectible);
const item = new Collectible({
  x: pos.x,
  y: pos.y,
  src: collectible.src,
  value: collectible.points,
  id: nanoid(),
});

// Creates listeners for all sockets
io.on("connection", (socket) => {
  // Removes the player who left the game from the list of players
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

    // Sets up the collectible
    socket.emit("setCollectible", item);

    // Adds opponents to the game
    socket.emit("getOpponents", connectedPlayers);
    socket.broadcast.emit("getOpponents", connectedPlayers);

    // Updates the current player's score in the player array
    socket.on("scored", (player) => {
      let index = connectedPlayers.findIndex((p) => p.id == player.id);
      connectedPlayers[index].score = player.score;
      socket.emit("getRank", connectedPlayers);
      socket.broadcast.emit("getRank", connectedPlayers);
    });

    // Sends the correct rank to the client
    socket.on("requestRank", () => {
      console.log(connectedPlayers.length);
      socket.emit("getRank", connectedPlayers);
      socket.broadcast.emit("getRank", connectedPlayers);
    });

    socket.on("movePlayer", (player) => {});

    socket.on("playerCollideWithCollectible", (player) => {});
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
