import gameConfig from "../gameConfig.mjs";

const { title, controls, gameWidth, padding, infoHeight, gameSize } =
  gameConfig;

/**
 * Draws the UI for the game
 * @module ./public/utils/drawUI
 * @see https://github.com/pinglu85/fcc-secure-real-time-multiplayer-game/blob/main/public/drawUI.mjs
 *
 * @param ctx           Used for rendering
 * @param playerRank    Represents the player's rank
 *
 */
export default function drawUI(ctx, playerRank) {
  // Info border
  ctx.beginPath();
  ctx.rect(padding, infoHeight, gameSize.width, gameSize.height);
  ctx.strokeStyle = "#020702";
  ctx.stroke();
  ctx.closePath();

  // Game info text y position
  const infoTextPosY = infoHeight / 1.5;

  // Game controls
  ctx.fillStyle = "#ffffff";
  ctx.font = `12px 'Press Start 2P'`;
  ctx.textAlign = "start";
  ctx.fillText(controls, padding, infoTextPosY);

  // Game title
  ctx.font = `14px 'Press Start 2P'`;
  ctx.textAlign = "center";
  ctx.fillText(title, gameWidth / 2, infoTextPosY);

  // Player's rank
  ctx.font = `12px 'Press Start 2P'`;
  ctx.textAlign = "end";
  ctx.fillText(playerRank, gameWidth - padding, infoTextPosY);
}
