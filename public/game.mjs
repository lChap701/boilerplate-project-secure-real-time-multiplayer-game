import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import gameConfig from "./gameConfig.mjs";
import loadSprite from "./utils/loadSprite.mjs";
import drawUI from "./utils/drawUI.mjs";
import shadows from "./utils/shadows.mjs";
import startPos from "./utils/startPos.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

const { playerSprites, collectibleSprites } = gameConfig;
let player;
let curCollectible;
let playerRank = "Rank: 0 / 0";
let opponents = [];
let emitCollision = true;

/* Sets the size of the canvas */
canvas.width = gameConfig.gameWidth;
canvas.height = gameConfig.gameHeight;

/* Loads sprites */
const playerAvatars = playerSprites.srcs.map((src) =>
  loadSprite(playerSprites.width, playerSprites.height, src)
);
const itemSprites = Object.keys(collectibleSprites).map((sprite) =>
  loadSprite(
    collectibleSprites[sprite].width,
    collectibleSprites[sprite].height,
    collectibleSprites[sprite].src
  )
);

/* Adds a new player to the game */
socket.on("connect", () => {
  const pos = startPos(gameConfig.gameSize, playerSprites);
  player = new Player({ x: pos.x, y: pos.y, id: socket.id });
  socket.emit("joinGame", player);
});

/* Gets new opponents */
socket.on("getOpponents", (players) => {
  players
    .filter((p) => p.id !== player.id)
    .forEach((opponent) => {
      opponents.push(new Player(opponent));
    });
  socket.emit("requestRank");
});

/* Checks if collectible was taken and changes the current collectible */
socket.on("setCollectible", (collectible) => {
  if (curCollectible) emitCollision = true;
  curCollectible = new Collectible(collectible);
});

/* Gets the current rank of the player */
socket.on("getRank", (players) => {
  playerRank = player.calculateRank(players);
});

/* Updates the opponents array when an opponent leaves the game */
socket.on("opponentLeft", (id) => {
  opponents = opponents.filter((opponent) => opponent.id !== id);
  socket.emit("requestRank");
});

/* Allows the player to move */
document.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
    case "ArrowUp":
      player.dir = "up";
      break;
    case "s":
    case "ArrowDown":
      player.dir = "down";
      break;
    case "a":
    case "ArrowLeft":
      player.dir = "left";
      break;
    case "d":
    case "ArrowRight":
      player.dir = "right";
  }

  socket.emit("movePlayer", player);
});

/* Stops the player from moving */
document.addEventListener("keyup", ({ key }) => {
  if (
    player &&
    (key == "w" ||
      key == "ArrowUp" ||
      key == "s" ||
      key == "ArrowDown" ||
      key == "a" ||
      key == "ArrowLeft" ||
      key == "d" ||
      key == "ArrowRight")
  ) {
    player.dir = null;
    socket.emit("movePlayer", player);
  }
});

/* Updates the array of opponents when changes to an opponent occur */
socket.on("updateOpponent", (opponent) => {
  let index = opponents.findIndex((op) => op.id == opponent.id);
  opponents[index].dir = opponent.dir;
  opponents[index].x = opponent.x;
  opponents[index].y = opponent.y;
  opponents[index].score = opponent.score;
});

/* Upates the player score */
socket.on("updateScore", (score) => {
  player.score = score;
  socket.emit("scored", player);
});

/**
 * Draws sprites and creates the canavas for the ame
 */
function renderGame() {
  canvas.style.background = "#080";
  canvas.style.border = "3px solid #005500";
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draws game UI
  drawUI(context, playerRank);

  // Draws collectible
  if (curCollectible) curCollectible.draw(context, itemSprites);

  // Draws player's avatar
  if (player) player.draw(context, playerAvatars[0]);

  // Draws each opponent's avatar
  for (const opponent of opponents) {
    opponent.draw(context, playerAvatars[1]);
  }

  // Draws shadows on all sprites
  shadows(context);

  // Checks collision between player's avatar and collectible item
  if (
    player &&
    curCollectible &&
    player.collision(curCollectible) &&
    emitCollision
  ) {
    socket.emit("playerCollideWithCollectible");
    emitCollision = false;
  }

  requestAnimationFrame(renderGame);
}

// Calls renderGame() on load
requestAnimationFrame(renderGame);
