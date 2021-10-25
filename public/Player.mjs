import gameConfig from "./gameConfig.mjs";

const gameOffsetTop = gameConfig.infoHeight;
const gameOffsetLeft = gameConfig.padding;

/**
 * Module for creating player objects and keeping track of them
 * @module ./public/Player
 *
 */
class Player {
  constructor({ x, y, score = 0, id }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  /**
   * Allows players to move
   * @param dir     Represents the direction the player is going
   * @param speed   Represents the speed that they are moving at
   *
   */
  movePlayer(dir, speed) {}

  /**
   * Allows the player to collect items and allows boundries to be set
   * @param item    Represents the item that the player touched
   * @returns       Returns a boolean value to indicate if the item was collected
   */
  collision(item) {
    // some condition
    this.score += item.value;
    return true;
  }

  /**
   * Calculates the player's rank
   * @param arr     Represents the all players currently playing the game
   * @returns       Returns the rank of the player
   */
  calculateRank(arr) {
    let players = arr.filter((player) => player.id != this.id);
    let rank = 1;

    players.forEach((player) => {
      if (this.score < player.score) {
        rank++;
      }
    });

    return `Rank: ${rank} / ${arr.length}`;
  }

  /**
   * Draws the player on the canvas
   * @param context     Used to render 2D objects on the canvas
   * @param sprites     Represents an array of item sprites
   *
   */
  draw(context, sprites) {
    const x = this.x + gameOffsetLeft;
    const y = this.y + gameOffsetTop;
    const image = sprites.find((sprite) => sprite.src == this.src);
    context.drawImage(image.src, x, y, image.width, image.height);
  }
}

export default Player;
