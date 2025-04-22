//create variables
var gameChar_x;
var gameChar_y;
var floorPos_y;

var trees_x = [100, 300, 500, 750, 1200];
var clouds_x = [100, 270, 400, 800, 900];
var mountains_x = [200, 600, 1000];

var canyons;
var collectables;
var game_score;
var flagpole;
var lives;
var startPlummetingFrame;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var camera_PosX = 0;

function setup() {
  createCanvas(1024, 576);
  floorPos_y = height * 3 / 4;
  lives = 3;
  startGame();
}

function startGame() {
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  canyons = [
    { x: 300, width: 100 },
    { x: 700, width: 120 },
    { x: 1100, width: 80 }
  ];

  collectables = [
    { x_pos: 400, y_pos: floorPos_y - 50, size: 50, isFound: false },
    { x_pos: 800, y_pos: floorPos_y - 50, size: 50, isFound: false }
  ];

  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;

  game_score = 0;

  flagpole = { isReached: false, x_pos: 1500 };
}

function draw() {
  background(100, 155, 255);
  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height - floorPos_y);

  camera_PosX = gameChar_x - width / 2;
  push();
  translate(-camera_PosX, 0);

  drawClouds();
  drawMountains();
  drawTrees();
  drawCanyons();
  drawCollectables();
  renderFlagpole();

  drawGameChar();
  pop();

  fill(255);
  noStroke();
  text("Score: " + game_score, 20, 20);

  if (isLeft) gameChar_x -= 5;
  if (isRight) gameChar_x += 5;
  if (gameChar_y < floorPos_y) {
    isFalling = true;
    gameChar_y += 2;
  } else {
    isFalling = false;
  }

  if (!flagpole.isReached) checkFlagpole();

  for (let c of collectables) checkCollectable(c);
  for (let cn of canyons) checkCanyon(cn);

  checkPlayerDie();

  for (let i = 0; i < lives; i++) {
    fill(255, 0, 0);
    ellipse(30 + i * 30, 50, 20, 20);
  }

  if (lives < 1) {
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Game over. Press space to continue.", width / 2, height / 2);
    noLoop();
  }

  if (flagpole.isReached) {
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Level complete. Press space to continue.", width / 2, height / 2);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) isLeft = true;
  else if (keyCode === RIGHT_ARROW) isRight = true;
  else if ((keyCode === UP_ARROW || key === 'w') && !isFalling) {
    gameChar_y -= 100;
    isFalling = true;
  } else if (keyCode === 32) {
    if (lives < 1 || flagpole.isReached) {
      startGame();
      loop();
    }
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) isLeft = false;
  else if (keyCode === RIGHT_ARROW) isRight = false;
}

function drawClouds() {
  fill(234, 232, 232);
  for (let x of clouds_x) {
    ellipse(x, 190, 90, 60);
    ellipse(x + 20, 180, 80, 60);
    ellipse(x + 40, 190, 90, 60);
    ellipse(x - 10, 210, 100, 70);
    ellipse(x + 20, 200, 110, 80);
    ellipse(x + 50, 210, 100, 70);
    ellipse(x + 10, 225, 90, 60);
  }
}

function drawMountains() {
  fill(139, 137, 137);
  for (let x of mountains_x) {
    triangle(x - 50, floorPos_y - 100, x + 50, floorPos_y, x - 225, floorPos_y);
  }
}

function drawTrees() {
  for (let x of trees_x) {
    let treePos_y = floorPos_y;
    fill(67, 39, 15);
    rect(x, treePos_y - 150, 60, 150);
    fill(0, 155, 0);
    triangle(x - 50, treePos_y - 100, x + 30, treePos_y - 200, x + 110, treePos_y - 100);
    triangle(x - 50, treePos_y - 150, x + 30, treePos_y - 250, x + 110, treePos_y - 150);
  }
}

function drawCanyons() {
  fill(21, 19, 18);
  for (let c of canyons) {
    rect(c.x, floorPos_y, c.width, height - floorPos_y);
  }
}

function drawCollectables() {
  for (let c of collectables) {
    if (!c.isFound) drawCollectable(c.x_pos, c.y_pos, c.size);
  }
}

function drawCollectable(x, y, diameter) {
  fill(255, 255, 0);
  noStroke();
  ellipse(x, y, diameter / 5);
  for (let i = 0; i < 20; i++) {
    fill(random(200, 255), random(200, 255), 0);
    let offsetX = random(-10, 5);
    let offsetY = random(-10, 5);
    ellipse(x + offsetX, y + offsetY, diameter * 0.1);
  }
}

function drawGameChar() {
  fill(152, 192, 205);
  rect(gameChar_x - 16, gameChar_y - 38, 23, 30);
  fill(200, 150, 150);
  ellipse(gameChar_x - 3, gameChar_y - 50, 27);
  fill(0);
  ellipse(gameChar_x - 15, gameChar_y - 5, 10, 10);
  ellipse(gameChar_x + 5, gameChar_y - 5, 10, 10);
}

function renderFlagpole() {
  push();
  strokeWeight(5);
  stroke(100);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
  fill(255, 0, 255);
  noStroke();
  if (flagpole.isReached) {
    rect(flagpole.x_pos, floorPos_y - 250, 50, 25);
  } else {
    rect(flagpole.x_pos, floorPos_y - 50, 50, 25);
  }
  pop();
}

function checkFlagpole() {
  if (abs(gameChar_x - flagpole.x_pos) < 15) {
    flagpole.isReached = true;
  }
}

function checkCollectable(collectable) {
  if (!collectable.isFound &&
    dist(gameChar_x, gameChar_y, collectable.x_pos, collectable.y_pos) < collectable.size / 2) {
    collectable.isFound = true;
    game_score++;
  }
}

function checkCanyon(canyon) {
  if (
    gameChar_x > canyon.x &&
    gameChar_x < canyon.x + canyon.width &&
    gameChar_y === floorPos_y
  ) {
    isPlummeting = true;
  }

  if (isPlummeting) {
    gameChar_y += 5;
  }
}

function checkPlayerDie() {
  if (gameChar_y > height + 100) {
    lives--;
    if (lives > 0) {
      startGame();
    }
  }
}
