require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");
import Collectible from "./public/Collectible.mjs";

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

// Adds an item
const item = new Collectible({
  /*x: x 
  y: y
  value: value*/
  id: nanoid(),
});

// Array containing all players
let players = [];

// Creates listeners for all sockets
io.on("connection", (socket) => {
  // Adds players, opponents, and items to the game
  socket.on("joinGame", (player) => {
    players.push(player);

    // Adds an opponent
    socket.emit("addOpponent", (opponent) => {
      players.push(opponent);
    });

    // Adds an items
    socket.emit("addItem", item);
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
