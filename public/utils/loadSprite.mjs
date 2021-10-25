/**
 * Pre-loads sprites
 * @module ./public/utils/loadSprite
 *
 * @param width     Represents the desired width
 * @param height    Represents the desired height
 * @param src       Represents the location of the sprite
 *
 * @returns     Returns the sprite
 */
const loadSprite = (width, height, src) => {
  const sprite = new Image(width, height);
  sprite.src = src;
  return sprite;
};

export default loadSprite;
