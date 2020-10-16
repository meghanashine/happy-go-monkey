var PLAY = 1;
var END = 0;
var gameState = PLAY;
var monkeyc, monkey_running, ground , groundImage, rock, gameover, reset;
var banana, bananaImage, obstacleImage, rockImage, gameoverI, resetI;
var bananas, obstacles;
var score = 0
var survivaltime = 0;

function preload() {
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  monkeyc = loadAnimation("sprite_7.png");

  bananaImage = loadImage("banana.png");
  obstaceImage = loadImage("obstacle.png");
  groundImage = loadImage("ground2.png");
  rockImage = loadImage("obstacle.png");

  gameoverI = loadImage("game_over.png");
  resetI = loadImage("reset_button.jpg");

}

function setup() {
  createCanvas(600, 400);

  monkey = createSprite(100, 300, 20, 20);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkeyc);
  monkey.scale = 0.15;
  monkey.setCollider("rectangle", -90, 0, 300, 600);
  //monkey.debug=true;

  ground = createSprite(300, 320, 600, 6);
  //ground.velocityX=0;
  ground.addImage(groundImage);

  iground = createSprite(300, 340, 600, 6);
  iground.visible = false;

  rock = createSprite(610, 315, 20, 20);

  bananas = new Group();
  obstacles = new Group();

  gameover = createSprite(300, 180, 20, 20);
  gameover.addImage(gameoverI);
  gameover.scale = 0.08;

  reset = createSprite(300, 210, 20, 20);
  reset.addImage(resetI);
  reset.scale = 0.04;
}

function draw() {
  background(255);

  fill("black");
  textSize(15);
  text("Survival Time : " + survivaltime, 455,  50);

  text("Score : " + score, 80, 50);

  monkey.collide(iground);

  console.log(monkey.y);

  if (gameState === PLAY) {

    if (keyDown("space") && monkey.y > 289) {
      monkey.velocityY = -13;
    }

    gameover.visible = false;
    reset.visible = false;

    survivaltime = Math.ceil(frameCount);

    //ground.x=ground.width/2;
    ground.velocityX = -(6 + 2 * score / 10);

    monkey.velocityY = monkey.velocityY + 0.7;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (bananas.isTouching(monkey)) {
      bananas.destroyEach();
      score = score + 2;
    }


    food();
    obstacle();

    if (obstacles.isTouching(monkey)) {
      ground.velocityX = 0;
      obstacles.setLifetimeEach(-1);
      bananas.destroyEach();
      monkey.changeAnimation("collided", monkeyc);
      gameState = END;
    }
  } else if (gameState === END) {

    ground.velocityX = 0;
    bananas.setVelocityXEach(0);
    obstacles.setVelocityXEach(0);
    gameover.visible = true;
    reset.visible = true;

    if (mousePressedOver(reset)) {
      resetting();
    }

    //monkey.addAnimation("collided");
  }


  ground.depth = monkey.depth;
  monkey.depth = monkey.depth + 1;
  rock.depth = monkey.depth;

  //console.log(monkey.y);
  //console.log(frameCount);

  drawSprites();

}

function food() {
  if (frameCount % 90 === 0) {
    banana = createSprite(600, 0, 50, 50);
    banana.y = Math.round(random(160, 250));
    banana.scale = 0.1;
    banana.addImage(bananaImage);
    banana.velocityX = -(6 + score / 8);
    banana.lifetime = 130;
    bananas.add(banana);
    banana.setCollider("rectangle", 0, 0, 550, 300);
    //banana.debug=true;
  }
}

function obstacle() {
  if (frameCount % 270 === 0) {
    rock = createSprite(610, 315, 20, 20);
    rock.velocityX = -(6 + score / 8);
    rock.addImage(rockImage);
    rock.scale = 0.13;
    rock.lifetime = 110;
    obstacles.add(rock);
    rock.setCollider("circle", 0, -20, 170)
    //rock.debug=true;
  }
}

function resetting() {
  gameState = PLAY;
  obstacles.destroyEach();
  monkey.changeAnimation("running");

  score = 0;
  frameCount = 0;
}