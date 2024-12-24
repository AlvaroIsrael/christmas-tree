const canvas = document.createElement("canvas");
if (!canvas) throw new Error("Canvas could not be created");

canvas.width = 450;
canvas.height = 600;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("2D rendering context could not be initialized");

let isFirstLine = true;
const kBallsMaxQuantity = 100;  // Defina a quantidade de bolas que você quer renderizar
const kBallsMaxPercentage = 400;  // Define o percentual máximo de bolas que você quer renderizar
const kBallsSize = 10;  // Define o tamanho das bolas
const colors = ["#960000", "#c20114", "#FFCB17", "#ffcf99", "#FCB600"];  // Define as cores das bolas

function lineTo(x, y, len, angle, isTrunk = false) {
  const x2 = x + len * Math.cos(angle);
  const y2 = y + len * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);

  if (isFirstLine) {
    ctx.strokeStyle = "#964B00";
    ctx.lineWidth = 10;
    isFirstLine = false;
  } else if (isTrunk) {
    ctx.strokeStyle = "#964B00";
    ctx.lineWidth = 5;
  } else {
    ctx.strokeStyle = "green";
    ctx.lineWidth = Math.random() * 80;
  }

  ctx.stroke();

  if (!isTrunk) {
    ctx.lineWidth = 2;
  }

  return { x: x2, y: y2 };
}

function tree(x, y, len, angle) {
  const strangeAngle = Math.PI / 24.0;
  const lenMin = 2.0;
  const lenDiv = 0.4;

  const endpoints = [];

  endpoints.push(lineTo(x, y, len, angle + strangeAngle, true));

  endpoints.push(lineTo(x, y, -len, angle, true));
  endpoints.push(lineTo(x, y, len, angle + (2 * Math.PI) / 3.0 + strangeAngle, true));
  endpoints.push(lineTo(x, y, len, angle - (2 * Math.PI) / 3.0 + strangeAngle));

  if (len > lenMin) {
    endpoints.push(
      ...tree(
        x + len * Math.cos(angle + strangeAngle),
        y + len * Math.sin(angle + strangeAngle),
        2 * len * lenDiv,
        angle + strangeAngle
      )
    );
    endpoints.push(
      ...tree(
        x + len * Math.cos(angle + (2 * Math.PI) / 3.0 + strangeAngle),
        y + len * Math.sin(angle + (2 * Math.PI) / 3.0 + strangeAngle),
        len * lenDiv,
        angle + (2 * Math.PI) / 3.0 + strangeAngle
      )
    );
    endpoints.push(
      ...tree(
        x + len * Math.cos(angle - (2 * Math.PI) / 3.0 + strangeAngle),
        y + len * Math.sin(angle - (2 * Math.PI) / 3.0 + strangeAngle),
        len * lenDiv,
        angle - (2 * Math.PI) / 3.0 + strangeAngle
      )
    );
  }

  return endpoints;
}

function drawStar(x, y, radius1, radius2, npoints) {
  const angle = (2 * Math.PI) / npoints;
  const halfAngle = angle / 2.0;

  ctx.beginPath();
  for (let i = 0; i < npoints; i++) {
    const x1 = x + Math.cos(i * angle) * radius2;
    const y1 = y + Math.sin(i * angle) * radius2;
    ctx.lineTo(x1, y1);

    const x2 = x + Math.cos(i * angle + halfAngle) * radius1;
    const y2 = y + Math.sin(i * angle + halfAngle) * radius1;
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.fillStyle = "#ffed29";
  ctx.fill();
  ctx.strokeStyle = "#ffed29";
  ctx.stroke();
}

let colorIndex = 0;

function drawBall(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = colors[colorIndex];
  ctx.fill();
  colorIndex = (colorIndex + 1) % colors.length;
}

function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lineTo(210, 400, 160, Math.PI / 2.0);
  const endpoints = tree(210, 400, 75, -Math.PI / 2.0);

  drawStar(390, 120, 10, 20, 5);

  let currentPercentage = 100 / kBallsMaxQuantity;

  let remainingPoints = kBallsMaxQuantity;
  let index = 0;

  while (remainingPoints > 0 && index < endpoints.length) {
    const interval = Math.floor(endpoints.length * currentPercentage / kBallsMaxPercentage);

    if (interval === 0) {
      index++;
      continue;
    }

    if (index % interval === 0) {
      drawBall(endpoints[index].x, endpoints[index].y, kBallsSize);
      remainingPoints--;

      currentPercentage += 5;
    }

    index++;
  }
}

main();
