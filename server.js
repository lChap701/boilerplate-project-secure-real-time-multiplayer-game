require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const socket = require("socket.io");
const http = require("http");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

/**
 * Module that contains the entire application
 * @module ./server
 *
 */
const app = express();

// Socket.io Setup
const server = http.createServer(app);
const io = socket(server);

// Helmet setup
app.use(
  helmet({
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: {
      setTo: "PHP 7.4.3",
    },
  })
);

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
