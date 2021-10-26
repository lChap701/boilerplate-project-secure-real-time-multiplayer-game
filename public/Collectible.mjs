import gameConfig from "./gameConfig.mjs";

const gameOffsetTop = gameConfig.infoHeight;
const gameOffsetLeft = gameConfig.padding;

/**
 * Module for creating items and keeping track of them
 * @module ./public/Collectible
 *
 */
class Collectible {
  constructor({ x, y, value = 1, id, src = "" }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.src = src;
  }

  /**
   * Draws the collectible on the canvas
   * @param context     Used to render 2D objects on the canvas
   * @param sprites     Represents an array of item sprites
   *
   */
  draw(context, sprites) {
    const x = this.x + gameOffsetLeft;
    const y = this.y + gameOffsetTop;
    const image = sprites.find((sprite) => sprite.src.includes(this.src));
    context.drawImage(image, x, y, image.width, image.height);
  }
}

/*
 * Note: Attempt to export this for use in server.js
 */
try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;
