/**
 * Module for creating player objects and keeping track of them
 * @module ./public/Player
 *
 */
class Player {
  constructor({ x, y, score, id }) {
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
   * Allows the player to collect items
   * @param item    Represents the item that should be collected
   *
   */
  collision(item) {}

  /**
   * Calculates the player's rank
   * @param arr     Represents the all players currently playing the game
   */
  calculateRank(arr) {}
}

export default Player;
