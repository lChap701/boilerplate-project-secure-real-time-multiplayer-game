/**
 * Module for getting the starting position for a sprite
 * @module ./public/utils/startPos
 *
 * @param gameField   Represents the size of the game
 * @param sprite      Represents the sprite
 *
 * @returns           Returns the starting position
 */
const startPos = (gameField, sprite) => {
  return {
    x: Math.random() * (gameField.width - sprite.width),
    y: Math.random() * (gameField.height - sprite.height),
  };
};

/*
 * Note: Attempts to export this for use in server.js
 */
try {
  module.exports = startPos;
} catch (e) {}

export default startPos;
