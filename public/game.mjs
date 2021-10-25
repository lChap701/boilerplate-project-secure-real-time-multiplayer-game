import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import gameConfig from "./gameConfig.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");
