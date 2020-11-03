//Create variables here
var dog,happydog,database,foodS,foodStock;
var dogImg,sadDog;
var lastfed;
var feed,foodObj;
var readState,changeState;
var bedimg,gardenimg,washimg,foodimg;
var state; 

function preload(){
  dogImg=loadImage("images/dogImg.png");
  happydog=loadImage("images/dogImg1.png");
  foodimg=loadImage("images/Food Stock.png");
  bedimg=loadImage("images/Bed Room.png");
  gardenimg=loadImage("images/Garden.png");
  washimg=loadImage("images/Wash Room.png");
  sadDog=loadImage("images/deadDog.png");
}

function setup() {
  createCanvas(500, 500);
  
  dog=createSprite(250,250,10,10);
  dog.addImage(dogImg);
  dog.scale=0.4;

  database=firebase.database();

  readState=database.ref('gamestate');
  readState.on("value",function(data){
    gamestate=data.val();
  });

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700,120);
  if(foodStock === 0){
    feed.mousePressed(error);
    }
    else{
      feed.mousePressed(feedDog)
    }
    add = createButton("Add Food");
    add.position(700,160);
    add.mousePressed(addFoods,foodObj);
  }

function draw() {  
 background(46, 139, 87);

 foodObj.display();

 if(state !== "Hungry"){
  feed.hide();
  add.hide();
  dog.remove();
}else{
  feed.show();
  add.show();
  dog.addImage("sadDog");
}

currentTime = hour();
if(currentTime === (lastfed + 1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime === (lastfed + 2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime > (lastfed +2) && currentTime <= (lastfed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry")
  foodObj.display();
}
 
 if(foodS<=0){
  foodS=0;
  dog.addImage(dogImg);
}

fedtime=database.ref('feedtime');
fedtime.on("value",function(data){
 lastfed=data.val();

})
if(lastfed>=12){
  fill("white");
  textSize(20);
  text("Last Feed : "+ lastfed%12 + "PM", 250,30);
}
else if(lastfed==0){
  fill("white");
  textSize(20);
  text("Last Feed: 12 AM",250,30);
}
else{
  fill("white");
  textSize(20);
  text("Last Feed : "+ lastfed + "AM",250,30);
}
 drawSprites();
  //add styles here
  fill("white");
  stroke(0);
  textSize(20);
  text("Food Remaining :"+foodS,170,450);
}

function readStock(data){
  foodS=data.val();
}
function writeStock(x){
  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}
function addFoods(){
  foodS++;
  dog.addImage(dogImg);
  foodObj.updateFoodStock(foodS);
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happydog);
  foodS--;
  foodObj.updateFoodStock(foodS);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedtime: hour()
  })
}

function error(){
  text("No Food Left For Pet", 400,400);
}
function update(state){
  database.ref('/').update({
    gamestate:state
  });
}