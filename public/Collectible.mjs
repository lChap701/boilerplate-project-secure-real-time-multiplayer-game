/**
 * Module for creating items and keeping track of them
 * @module ./public/Collectible
 *
 */
class Collectible {
  constructor({ x, y, value = 0, id, src = "" }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.src = src;
  }
}

/*
 * Note: Attempt to export this for use in server.js
 */
try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;
