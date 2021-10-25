/**
 * Module that is used to configure the game
 * @module ./public/gameConfig
 *
 */
const gameConfig = {
  title: "Dog Days",
  instructions: "Collect as many sticks, bones, and tennis balls as you can!!",
  gameWidth: 800, // will change later
  gameHeight: 500,
  padding: 10,
  infoHeight: 80,
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
      width: 19,
      height: 9,
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
