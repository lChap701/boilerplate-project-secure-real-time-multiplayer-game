/**
 * Module that is used to configure the game
 * @module ./public/gameConfig
 * @see https://github.com/pinglu85/fcc-secure-real-time-multiplayer-game/blob/main/public/gameConfig.mjs
 * 
 */
const gameConfig = {
  title: "Dog Days",
  controls: "Controls: WASD or arrow keys",
  gameWidth: 952,
  gameHeight: 488,
  padding: 10,
  infoHeight: 40,
  get gameSize() {
    return {
      width: this.gameWidth - 2 * this.padding,
      height: this.gameHeight - this.padding - this.infoHeight,
    };
  },
  playerSprites: {
    width: 40,
    height: 40,
    srcs: ["/assets/Player.png", "/assets/Opponent.png"],
  },
  collectibleSprites: {
    ball: {
      width: 20,
      height: 20,
      src: "/assets/Ball.png",
      points: 5,
    },
    stick: {
      width: 36,
      height: 16,
      src: "/assets/Stick.png",
      points: 10,
    },
    bone: {
      width: 38,
      height: 18,
      src: "/assets/Bone.png",
      points: 15,
    },
  },
  get selectCollectible() {
    let sprites = ["ball", "stick", "bone"];
    return this.collectibleSprites[
      sprites[Math.floor(Math.random() * sprites.length)]
    ];
  },
};

/*
 * Note: Attempts to export this for use in server.js
 */
try {
  module.exports = gameConfig;
} catch (e) {}

export default gameConfig;
