/**
 * Module that adds shadows to all sprites
 * @module ./public/utils/shadows
 *
 * @param context     Represents the sprites ono the canvas
 *
 */
export default function shadows(context) {
  context.shadowColor = "rgba(0, 0, 0, 0.8)";
  context.shadowBlur = 5;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
}
