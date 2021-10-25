import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import gameConfig from "./gameConfig.mjs";
import loadSprite from "./utils/loadSprite.mjs";
import shadows from "./utils/shadows.mjs";
import startPos from "./utils/startPos.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

const { playerSprites, collectibleSprites } = gameConfig;
let player;

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
  const pos = startPos(gameConfig.size, playerSprites);
  player = new Player({ x: pos.x, y: pos.y, id: socket.id });
  socket.emit("joinGame", player);
});

socket.on("init", ({ players, collectible }) => {});
