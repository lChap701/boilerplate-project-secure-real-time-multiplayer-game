import gameConfig from "./gameConfig.mjs";

const { gameSize, playerSprites, collectibleSprites } = gameConfig;
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
    this.speed = 4;
    this.dir = null;
  }

  /**
   * Allows players to move
   * @param dir     Represents the direction the player is going
   * @param speed   Represents the speed that they are moving at
   *
   */
  movePlayer(dir, speed) {
    switch (dir) {
      case "up":
        this.y -= this.y - speed < 0 ? 0 : speed;
        break;
      case "down":
        this.y =
          this.y + speed > gameSize.height - playerSprites.height
            ? gameSize.height - playerSprites.height
            : this.y + speed;
        break;
      case "left":
        this.x -= this.x - speed < 0 ? 0 : speed;
        break;
      case "right":
        this.x =
          this.x + speed > gameSize.width - playerSprites.width
            ? gameSize.width - playerSprites.width
            : this.x + speed;
        break;
      default:
        this.x = this.x;
        this.y = this.y;
    }
  }

  /**
   * Allows the player to collect items and allows boundries to be set
   * @param item    Represents the item that the player touched
   * @returns       Returns a boolean value to indicate if the item was collected
   */
  collision(item) {
    let itemWidth;
    let itemHeight;

    Object.keys(collectibleSprites).forEach((key) => {
      if (collectibleSprites[key].src == item.src) {
        itemWidth = collectibleSprites[key].width;
        itemHeight = collectibleSprites[key].height;
      }
    });

    if (this.x == item.x && this.y == item.y) return true;

    // Contains all sides (from top left to bottom right) of the avatar
    const avatarSides = {
      left: {
        x: this.x,
        y: this.y,
      },
      right: {
        x: this.x + playerSprites.width,
        y: this.y + playerSprites.height,
      },
    };

    // Contains all sides (from top left to bottom right) of the collectible sprite
    const itemSides = {
      left: {
        x: item.x,
        y: item.y,
      },
      right: {
        x: item.x + itemWidth,
        y: item.y + itemHeight,
      },
    };

    // Checks if the player sprite intersected with the item
    if (
      avatarSides.left.x < itemSides.right.x &&
      itemSides.left.x < avatarSides.right.x &&
      avatarSides.right.y > itemSides.left.y &&
      itemSides.right.y > avatarSides.left.y
    ) {
      return true;
    }

    return false;
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
   * @param sprite      Represents the player sprie
   *
   */
  draw(context, sprite) {
    if (this.dir) {
      this.movePlayer(this.dir, this.speed);
    }

    const x = this.x + gameOffsetLeft;
    const y = this.y + gameOffsetTop;
    context.drawImage(sprite, x, y, sprite.width, sprite.height);
  }
}

export default Player;
