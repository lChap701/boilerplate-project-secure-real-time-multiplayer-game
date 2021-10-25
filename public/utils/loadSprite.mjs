/**
 * Pre-loads sprites
 * @module ./public/utils/loadSprite
 *
 * @param src   Represents the location of the sprite
 *
 * @returns     Returns the sprite
 */
const loadSprite = (src) => {
  const sprite = new Image();
  sprite.src = src;
  return sprite;
};

export default loadSprite;
