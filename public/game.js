var gameChar_x;
var gameChar_y;
var floorPos_y;

var trees_x = [100, 300, 500, 750, 1200]; // Initialize the tree positions in an array
var clouds_x = [100, 270, 400, 800, 900]; // Initialize the cloud positions in an array
var mountains_x = [200, 600, 1000]; // Initialize the mountain positions in an array

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
  lives = 3; // Initialize the lives to 3
  startGame();
}

function startGame() {
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  canyons = [
    { x: width / 3, width: 100 },
    { x: width / 3 + 400, width: 120 },
    { x: width / 3 + 800, width: 80 }
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
  ///////////DRAWING CODE//////////

  background(100, 155, 255); //fill the sky blue

  noStroke();
  fill(0, 155, 0);

  rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

  camera_PosX = gameChar_x - width / 2;
  push();
  translate(-camera_PosX, 0);
  // draw the clouds
  drawClouds();

  // draw the mountains
  fill(139, 137, 137);
  for (var i = 0; i < mountains_x.length; i++) {
    triangle(
      mountains_x[i] - 50,
      floorPos_y - 100,
      mountains_x[i] + 50,
      floorPos_y,
      mountains_x[i] - 225,
      floorPos_y
    );
  }

  for (var i = 0; i < trees_x.length; i++) {
    // draw the tree
    var treePos_y = floorPos_y;

    fill(67, 39, 15);
    rect(trees_x[i], treePos_y - 150, 60, 150);

    // draw the branches
    fill(0, 155, 0);
    triangle(
      trees_x[i] - 50,
      treePos_y - 100,
      trees_x[i] + 30,
      treePos_y - 200,
      trees_x[i] + 110,
      treePos_y - 100
    );
    triangle(
      trees_x[i] - 50,
      treePos_y - 150,
      trees_x[i] + 30,
      treePos_y - 250,
      trees_x[i] + 110,
      treePos_y - 150
    );
  }

  // draw the canyons
  for (var i = 0; i < canyons.length; i++) {
    fill(21, 19, 18);
    rect(canyons[i].x, floorPos_y, canyons[i].width, height - floorPos_y);
  }

 // Draw collectables if not found
    for (let i = 0; i < collectables.length; i++) {
        let collectable = collectables[i];
        if (!collectable.isFound) {
            drawCollectable(collectable.x_pos, collectable.y_pos, collectable.size);
        }
    }
  // draw the game character
  fill(152, 192, 205);
  rect(gameChar_x - 16, gameChar_y - 38, 23, 30);
  fill(200, 150, 150);
  ellipse(gameChar_x - 3, gameChar_y - 50, 27);
  fill(0);
  ellipse(gameChar_x - 15, gameChar_y - 5, 10, 10);
  ellipse(gameChar_x + 5, gameChar_y - 5, 10, 10);
    
  renderFlagpole();
    
  pop();

  fill(255);
  noStroke();
  text("Score: " + game_score, 20, 20);

  ///////////INTERACTION CODE//////////

  if (isLeft) {
    gameChar_x -= 5;
  }

  if (isRight) {
    gameChar_x += 5;
  }

  if (isFalling && gameChar_y < floorPos_y) {
    gameChar_y += 2;
  } else {
    isFalling = false;
  }

  if (flagpole.isReached == false) {
    checkFlagpole();
  }

  // Check for collision with collectables
  for (var i = 0; i < collectables.length; i++) {
    checkCollectable(collectables[i]);
  }

  // Check for falling into the canyon
  for (var i = 0; i < canyons.length; i++) {
    checkCanyon(canyons[i]);
  }

  checkPlayerDie();

  // Draw life tokens to keep track of remaining lives
  for (var i = 0; i < lives; i++) {
    fill(255, 0, 0);
    ellipse(30 + i * 30, 50, 20, 20);
  }

  ///////////GAME OVER AND LEVEL COMPLETE TEXT//////////

  if (lives < 1) {
    // Display "Game over" text when lives are less than 1
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Game over. Press space to continue.", width / 2, height / 2);
    noLoop(); // Prevent further game logic
  }

  if (flagpole.isReached) {
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Level complete. Press space to continue.", width / 2, height / 2);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    isLeft = true;
  } else if (keyCode === RIGHT_ARROW) {
    isRight = true;
  } else if ((keyCode === UP_ARROW || key === "w") && !isFalling) {
    gameChar_y -= 100;
    isFalling = true;
  } else if (keyCode === 32) {
    // If spacebar is pressed
    if (lives < 1 || flagpole.isReached) {
      // If game over or level complete, restart the game by calling startGame()
      startGame();
      loop(); // Restart game logic
    }
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    isLeft = false;
  } else if (keyCode === RIGHT_ARROW) {
    isRight = false;
  }
}

// refactoring with functions

function drawClouds() {
  fill(234, 232, 232);
  for (var i = 0; i < clouds_x.length; i++) {
    ellipse(clouds_x[i], 190, 90, 60); // Ellipse 1
    ellipse(clouds_x[i] + 20, 180, 80, 60); // Ellipse 2
    ellipse(clouds_x[i] + 40, 190, 90, 60); // Ellipse 3
    ellipse(clouds_x[i] - 10, 210, 100, 70); // Ellipse 4
    ellipse(clouds_x[i] + 20, 200, 110, 80); // Ellipse 5
    ellipse(clouds_x[i] + 50, 210, 100, 70); // Ellipse 6
    ellipse(clouds_x[i] + 10, 225, 90, 60); // Ellipse 7
  }
}

function drawCollectable(x, y, diameter) {
    let baseColor = color(255, 255, 0);

    // Draw the base circle
    fill(baseColor);
    noStroke();
    ellipse(x, y, diameter / 5);

    for (let i = 0; i < 50; i++) {
        let sparkleColor = color(
            random(200, 255), 
            random(200, 255), 
            0                
        );

        fill(sparkleColor);
        let offsetX = random(-10, 5); 
        let offsetY = random(-10, 5); 
        ellipse(x + offsetX, y + offsetY, diameter * 0.1); // Adjust size of sparkles
    }
}

function renderFlagpole()
{
    push();
    
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255, 0, 255);
    noStroke();
    if(flagpole.isReached)
    {
    rect(flagpole.x_pos, floorPos_y - 250, 50, 25);
    }
    else{
        rect(flagpole.x_pos, floorPos_y - 50, 50, 25);
    }
     pop();
}


function checkFlagpole()
{
 var d = abs(gameChar_x - flagpole.x_pos);
    if(d < 15)
        {
            flagpole.isReached = true;
        }
}
function checkCollectable(collectable) {
  if (
    !collectable.isFound &&
    dist(gameChar_x, gameChar_y, collectable.x, collectable.y) < collectable.size / 2
  ) {
    collectable.isFound = true;
    game_score += 1;
  }
}

function checkCanyon(canyon) {
  if (
    !isPlummeting &&
    gameChar_x > canyon.x &&
    gameChar_x < canyon.x + canyon.width &&
    gameChar_y >= floorPos_y
  ) {
    // Start falling down the canyon after a short delay (2 seconds or 120 frames)
    startPlummetingFrame = frameCount;
    isPlummeting = true;
  }

  if (isPlummeting) {
    // Calculate the time since the character started plummeting in seconds
    var timeSinceStart = (frameCount - startPlummetingFrame) / frameRate();

    // Set the fall speed in pixels per second (adjust this value to control fall speed)
    var maxFallSpeed = 500; // Adjust this value to control the maximum fall speed
    var minFallSpeed = 20; // Adjust this value to control the minimum fall speed

    // Calculate the fall distance based on fall speed
    var fallDistance = map(timeSinceStart, 0, 2, minFallSpeed, maxFallSpeed);

    // Limit the fall distance to the height of the canyon
    fallDistance = min(fallDistance, height - floorPos_y);

    // Update the character position
    gameChar_y = floorPos_y + fallDistance;
  }
}

function checkPlayerDie() {
  if (gameChar_y > height || isPlummeting) {
    // If the character falls below the canvas or into the canyon, reset the character position
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    isPlummeting = false;

    // Decrement the lives counter by one
    lives--;

    if (lives <= 0) {
      // Game over condition - reset game
      startGame();
    }
  }
}
