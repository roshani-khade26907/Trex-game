var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud,cloudImage;
var obstacles,obstacle1Image,obstacle2Image,obstacle3Image,obstacle4Image,obstacle5Image,obstacle6Image;
var score=0;
var cloudsGroup,obstaclesGroup;
var PLAY=1;
var END=0;
var gameState=PLAY;
var gameOver,gameOverImg,restart,restartImg;
var jumpSound,dieSound,checkPointSound;

function preload() {
      trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
      trex_collided = loadImage("trex_collided.png");
      groundImage = loadImage("ground2.png");
      cloudImage=loadImage("cloud.png");
      obstacle1Image=loadImage("obstacle1.png");
      obstacle2Image=loadImage("obstacle2.png");
      obstacle3Image=loadImage("obstacle3.png");
      obstacle4Image=loadImage("obstacle4.png");
      obstacle5Image=loadImage("obstacle5.png");
      obstacle6Image=loadImage("obstacle6.png");
      gameOverImg=loadImage("gameOver.png");
      restartImg=loadImage("restart.png");
      jumpSound=loadSound("jump.mp3");
      dieSound=loadSound("die.mp3");
      checkPointSound=loadSound("checkPoint.mp3");
}

function setup() {
    createCanvas(600, 200);

    //create a trex sprite
    trex = createSprite(50,160,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided",trex_collided);
    trex.scale = 0.5;

    //create a ground sprite
    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    
    
    invisibleGround=createSprite(200,190,400,10);
    invisibleGround.visible=false;
  
    cloudsGroup=new Group();
    obstaclesGroup=new Group();
  
    //trex.debug=true
    trex.setCollider("circle",0,0,48)
  
    gameOver=createSprite(300,50,10,10);
    gameOver.addImage(gameOverImg);
    gameOver.scale=0.7;
  
    restart=createSprite(300,100,10,10);
    restart.addImage(restartImg);
    restart.scale=0.8;
}

function draw() {
    background("orange");
  text("score: "+score,500,50);
  if(gameState===PLAY){
        score=score+Math.round(getFrameRate()/60);
        ground.velocityX = -(6+3*score/100);
        if (keyDown("space")&& trex.y>=150) {
          trex.velocityY = -10;
          jumpSound.play();
        }
        trex.velocityY = trex.velocityY + 0.8
        if (ground.x < 0) {
          ground.x = ground.width / 2;
        }
        spawnClouds();
        spawnObstacles();
        if(obstaclesGroup.isTouching(trex) ){
          gameState=END;
          dieSound.play();
          //trex.velocityY=-10;
          //jumpSound.play();
        }
        gameOver.visible=false;
        restart.visible=false;
        if(score>0 && score%250===0){
          checkPointSound.play();  
        }
  }
  
  if(gameState===END){
     ground.velocityX=0;
     obstaclesGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setVelocityXEach(0);
     cloudsGroup.setLifetimeEach(-1);
     trex.velocityY=0; 
     trex.velocityX=0;
     gameOver.visible=true;
     restart.visible=true;
     trex.changeAnimation("collided",trex_collided);
     if(mousePressedOver(restart)){
       //console.log("restart the game");
       reset();
     }
   }
    
   trex.collide(invisibleGround);
   drawSprites();
    //console.timeEnd();
    //console.log(World.frameCount);
}
function spawnClouds(){
  if(frameCount%60===0){
     
    cloud=createSprite(600,50,10,10);
    cloud.addImage(cloudImage)
  cloud.y=Math.round(random(10,50))
  cloud.velocityX=-(6+3*score/100);
    cloud.scale=0.6;
    cloud.lifetime=200;
  cloud.depth=trex.depth;
  trex.depth=trex.depth+1;
   cloudsGroup.add(cloud); 
}
}
function spawnObstacles(){
  if(frameCount%60===0){
    obstacles=createSprite(600,165,10,40);
    obstacles.velocityX=-(6+3*score/100);
    var rsk=Math.round(random(1,6));
    switch(rsk){
      case 1:obstacles.addImage(obstacle1Image);
      break;
      case 2:obstacles.addImage(obstacle2Image);
      break;
      case 3:obstacles.addImage(obstacle3Image);
      break;
      case 4:obstacles.addImage(obstacle4Image);
      break;
      case 5:obstacles.addImage(obstacle5Image);
      break;
      case 6:obstacles.addImage(obstacle6Image);
      break;
      default:break;
    }
    obstacles.scale=0.5;
    obstacles.lifetime=190
    obstaclesGroup.add(obstacles);
  }
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
}