const clipboardy = require("clipboardy");

// Draw a card centered at position (x,y) with dots representing card n
const drawCard = (ctx, x, y, n) => {
  // Draw card (if there is a card to be drawn)
  if (n != 0) {
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.lineTo(x + 55, y - 80);
    ctx.lineTo(x - 55, y - 80);
    ctx.arc(x - 55, y - 75, 5, -Math.PI / 2, Math.PI, true);
    ctx.lineTo(x - 60, y + 75);
    ctx.arc(x - 55, y + 75, 5, Math.PI, Math.PI / 2, true);
    ctx.lineTo(x + 55, y + 80);
    ctx.arc(x + 55, y + 75, 5, Math.PI / 2, 0, true);
    ctx.lineTo(x + 60, y - 75);
    ctx.arc(x + 55, y - 75, 5, 0, -Math.PI / 2, true);
    ctx.fill();
    ctx.stroke();
  }

  // Draw dots
  // Red dots
  if (n & 0b1) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.lineTo(x - 14, y - 50);
    ctx.arc(x - 30, y - 50, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Orange dots
  if (n & 0b10) {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.lineTo(x + 46, y - 50);
    ctx.arc(x + 30, y - 50, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Yellow dots
  if (n & 0b100) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.lineTo(x - 14, y);
    ctx.arc(x - 30, y, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Green dots
  if (n & 0b1000) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.lineTo(x + 46, y);
    ctx.arc(x + 30, y, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Blue dots
  if (n & 0b10000) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.lineTo(x - 14, y + 50);
    ctx.arc(x - 30, y + 50, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Magenta dots
  if (n & 0b100000) {
    ctx.fillStyle = "magenta";
    ctx.beginPath();
    ctx.lineTo(x + 46, y + 50);
    ctx.arc(x + 30, y + 50, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Cyan dots
  if (n & 0b1000000) {
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.lineTo(x + 16, y - 25);
    ctx.arc(x, y - 25, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Dark Grey dots
  if (n & 0b10000000) {
    ctx.fillStyle = "#555555";
    ctx.beginPath();
    ctx.lineTo(x + 16, y + 25);
    ctx.arc(x, y + 25, 16, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
};

const drawField = (canvas, game) => {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#EEEEEE";
  ctx.rect(0, 0, 590, 675);
  ctx.fill();

  // Check what level difficulty we're on to determine card positions
  let cardPos;
  if (game.level == 8) {
    cardPos = [
      [95, 125],
      [295, 125],
      [495, 125],
      [95, 350],
      [295, 350],
      [495, 350],
      [95, 575],
      [295, 575],
      [495, 575],
    ];
  } else if (game.level == 7) {
    cardPos = [
      [95, 125],
      [295, 125],
      [495, 125],
      [195, 350],
      [395, 350],
      [95, 575],
      [295, 575],
      [495, 575],
    ];
  } else {
    cardPos = [
      [195, 125],
      [395, 125],
      [95, 350],
      [295, 350],
      [495, 350],
      [195, 575],
      [395, 575],
    ];
  }

  // Choose letterset for game
  let letterSet;
  if (game.level == 6) {
    letterSet = ["a", "b", "c", "d", "e", "f", "g"];
  } else if (game.level == 7) {
    letterSet = ["h", "i", "j", "k", "l", "m", "n", "o"];
  } else {
    letterSet = ["p", "q", "r", "s", "t", "u", "v", "w", "x"];
  }
  for (let i = 0; i <= game.level; i++) {
    drawCard(ctx, cardPos[i][0], cardPos[i][1], game.field[i]);
    ctx.lineWidth = 1.5;
    ctx.font = "30px monospace";
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    let letter = letterSet[i];
    let dx = ctx.measureText(letter).width;
    ctx.strokeText(letter, cardPos[i][0] - dx / 2, cardPos[i][1] - 90);
    ctx.fillText(letter, cardPos[i][0] - dx / 2, cardPos[i][1] - 90);
  }

  // console.log(`<img src="${canvas.toDataURL()}" />`);
  // clipboardy.writeSync(`<img src="${canvas.toDataURL()}" />`);
};

module.exports = { drawField };
