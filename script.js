const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --- Game objects ---
const paddleWidth = 12;
const paddleHeight = 90;

const leftPaddle = {
  x: 20,
  y: canvas.height / 2 - paddleHeight / 2,
  w: paddleWidth,
  h: paddleHeight,
  speed: 6,
  dy: 0,
  score: 0,
};

const rightPaddle = {
  x: canvas.width - 20 - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  w: paddleWidth,
  h: paddleHeight,
  speed: 6,
  dy: 0,
  score: 0,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 8,
  vx: 5,
  vy: 3,
};

function draw() {
  // Clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Center dashed line
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddles
  ctx.fillStyle = "white";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h);

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  // Score
  ctx.font = "32px Arial";
  ctx.fillText(leftPaddle.score, canvas.width / 2 - 60, 50);
  ctx.fillText(rightPaddle.score, canvas.width / 2 + 40, 50);
}

function clampPaddle(p) {
  if (p.y < 0) p.y = 0;
  if (p.y + p.h > canvas.height) p.y = canvas.height - p.h;
}

function update() {
  // Move paddles
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  clampPaddle(leftPaddle);
  clampPaddle(rightPaddle);

  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Bounce off top/bottom
  if (ball.y - ball.r <= 0 || ball.y + ball.r >= canvas.height) {
    ball.vy *= -1;
  }
}

function ballHitsPaddle(p) {
  return (
    ball.x - ball.r < p.x + p.w &&
    ball.x + ball.r > p.x &&
    ball.y - ball.r < p.y + p.h &&
    ball.y + ball.r > p.y
  );
}

function handleCollisions() {
  // Left paddle collision
  if (ballHitsPaddle(leftPaddle) && ball.vx < 0) {
    ball.vx *= -1;

    // Add a little "angle" based on hit position
    const hit = (ball.y - (leftPaddle.y + leftPaddle.h / 2)) / (leftPaddle.h / 2);
    ball.vy = hit * 4;
  }

  // Right paddle collision
  if (ballHitsPaddle(rightPaddle) && ball.vx > 0) {
    ball.vx *= -1;

    const hit = (ball.y - (rightPaddle.y + rightPaddle.h / 2)) / (rightPaddle.h / 2);
    ball.vy = hit * 4;
  }
}

function ballHitsPaddle(p) {
  return (
    ball.x - ball.r < p.x + p.w &&
    ball.x + ball.r > p.x &&
    ball.y - ball.r < p.y + p.h &&
    ball.y + ball.r > p.y
  );
}

function handleCollisions() {
  // Left paddle collision
  if (ballHitsPaddle(leftPaddle) && ball.vx < 0) {
    ball.vx *= -1;

    // Add a little "angle" based on hit position
    const hit = (ball.y - (leftPaddle.y + leftPaddle.h / 2)) / (leftPaddle.h / 2);
    ball.vy = hit * 4;
  }

  // Right paddle collision
  if (ballHitsPaddle(rightPaddle) && ball.vx > 0) {
    ball.vx *= -1;

    const hit = (ball.y - (rightPaddle.y + rightPaddle.h / 2)) / (rightPaddle.h / 2);
    ball.vy = hit * 4;
  }
}

const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key.toLowerCase() === "r") {
    leftPaddle.score = 0;
    rightPaddle.score = 0;
    leftPaddle.y = canvas.height / 2 - leftPaddle.h / 2;
    rightPaddle.y = canvas.height / 2 - rightPaddle.h / 2;
    resetBall(1);
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function handleInput() {
  // Left paddle: W/S
  leftPaddle.dy = 0;
  if (keys["w"] || keys["W"]) leftPaddle.dy = -leftPaddle.speed;
  if (keys["s"] || keys["S"]) leftPaddle.dy = leftPaddle.speed;

  // Right paddle: Up/Down
  rightPaddle.dy = 0;
  if (keys["ArrowUp"]) rightPaddle.dy = -rightPaddle.speed;
  if (keys["ArrowDown"]) rightPaddle.dy = rightPaddle.speed;
}

function loop() {
  handleInput();
  update();
  handleCollisions();
  handleScoring();
  draw();

  requestAnimationFrame(loop);
}

resetBall(1);
loop();
