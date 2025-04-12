// Global variables
let gameChar_x;
let gameChar_y;
let floorPos_y;
let scrollPos;
let gameChar_world_x;

let collectables = [];

function setup() {
  createCanvas(800, 400);
  floorPos_y = height * 3/4;
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;
  scrollPos = 0;
  gameChar_world_x = gameChar_x - scrollPos;

  startGame();
}

function draw() {
  background(100, 155, 255); // Sky
  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height - floorPos_y); // Ground

  // Scroll the scene
  push();
  translate(scrollPos, 0);

  // Draw collectables
  for (let i = 0; i < collectables.length; i++) {
    if (!collectables[i].isFound) {
      drawCollectable(collectables[i]);

      // Check for collection
      let d = dist(gameChar_world_x, gameChar_y, collectables[i].x_pos, collectables[i].y_pos);
      if (d < 30) {
        collectables[i].isFound = true;
      }
    }
  }

  pop();

  // Draw character
  drawGameChar();

  // Update world x position
  gameChar_world_x = gameChar_x - scrollPos;

  // Movement
  if (keyIsDown(LEFT_ARROW)) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 5;
    } else {
      scrollPos += 5;
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 5;
    } else {
      scrollPos -= 5;
    }
  }
}

function drawGameChar() {
  fill(0);
  ellipse(gameChar_x, gameChar_y - 20, 20); // Head
  rect(gameChar_x - 10, gameChar_y - 20, 20, 30); // Body
}

function drawCollectable(t_collectable) {
  fill(255, 223, 0);
  ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
}

function startGame() {
  collectables = [
    { x_pos: 300, y_pos: floorPos_y - 20, size: 30, isFound: false },
    { x_pos: 700, y_pos: floorPos_y - 20, size: 30, isFound: false },
    { x_pos: 1100, y_pos: floorPos_y - 20, size: 30, isFound: false }
  ];

  // Shift all collectables 24px right, 10px up
  for (let i = 0; i < collectables.length; i++) {
    collectables[i].x_pos += 24;
    collectables[i].y_pos -= 10;
  }
}
