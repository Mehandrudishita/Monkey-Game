var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running

var banana, bananaImage, obstacle, obstacleImage

var FoodGroup, obstacleGroup

var score = 0;
var survivaltime = 0;

function preload() {

  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  bananaImage = loadImage("banana.png");

  obstacleImage = loadImage("obstacle.png");

  starImage = loadImage("STAR.png");

}

function setup() {
  createCanvas(400, 400);

  monkey = createSprite(80, 315, 20, 20);
  monkey.addAnimation("monkeyrunning", monkey_running);
  monkey.scale = 0.1;

  ground = createSprite(400, 350, 900, 100);
  ground.velocityX = -4;
  ground.x = ground.width / 2;
  console.log(ground.x);

  foodGroup = createGroup();
  obstaclesGroup = createGroup();
  starGroup = createGroup();

}


function draw() {

  background("#190966");

  fill("white");
  textSize(20);


  if (gameState === PLAY) {
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    ground.velocityX = -(4 + 3 * survivaltime / 100);

    if (keyDown("SPACE") && monkey.y >= 269) {
      monkey.velocityY = -12;
      console.log(monkey.y);
    }

    survivaltime = Math.ceil(frameCount / frameRate());

    spawnObstacle();
    spawnBanana();
    spawnStars();

    monkey.velocityY = monkey.velocityY + 0.5;

    if (obstaclesGroup.isTouching(monkey)) {
      gameState = END;
    }

    if (foodGroup.isTouching(monkey)) {
      foodGroup.destroyEach();
      score = score + 1;
    }

  } else if (gameState === END) {
    ground.velocityX = 0;

    monkey.velocityY = 1;

    foodGroup.destroyEach();

    obstaclesGroup.setLifetimeEach(-1);
    starGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);
    starGroup.setVelocityXEach(0)

    text("Press R to restart", 120, 150);

    if (keyDown("R")) {
      Reset();
    }

  }

  monkey.collide(ground);

  drawSprites();

  text("Score : " + score, 260, 330);
  text("Survival time : " + survivaltime, 30, 330);

}

function spawnObstacle() {
  if (frameCount % 200 === 0) {
    var obstacle = createSprite(600, 270, 10, 10);
    obstacle.addImage("obstacles", obstacleImage);
    obstacle.scale = 0.2;
    obstacle.velocityX = -(6 + survivaltime / 100);
    obstacle.lifetime = 150;
    obstacle.setCollider("circle", 0, 0, width / 2 - 20);
    obstaclesGroup.add(obstacle);
  }
}

function spawnStars() {
  if (frameCount % 40 === 0) {
    star = createSprite(400, Math.round(random(20, 110)), 10, 10);
    star.addImage("star", starImage);
    star.scale = 0.02;
    star.velocityX = -3;
    star.lifetime = 133.3333;
    starGroup.add(star);

    star.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
  }
}


function spawnBanana() {
  if (frameCount % 80 === 0) {
    var banana = createSprite(200, Math.round(random(120, 200)), 10, 10);
    banana.addImage("banana", bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -4;
    banana.lifetime = 100;
    foodGroup.add(banana);
  }
}

function Reset() {
  gameState = PLAY;
  foodGroup.destroyEach();
  starGroup.destroyEach();
  obstaclesGroup.destroyEach();
  survivaltime = 0;
  score = 0;
}