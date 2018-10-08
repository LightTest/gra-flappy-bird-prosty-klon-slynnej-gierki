let cvs = document.querySelector("#canvass");
let ctx = cvs.getContext("2d");

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();
let gameOver = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";
gameOver.src = "images/game-over120.png";

//gap
let gap = 85;
let constant;

console.log(pipeNorth.height);
//position changes for a bird
let bX = 10;
let bY = 15;
let gravity = 1;

//audio

let fly = new Audio();
let scors = new Audio();

fly.src = "sounds/fly.mp3";
scors.src = "sounds/score.mp3";

// for counting audio

let zzz = 0;

//animation stop/start

let startStop = 1;

// on key up

document.addEventListener("keydown", moveUp);

function moveUp(event) {
  if (event.keyCode == 38 && startStop == 1) {
    bY -= 20;
    fly.currentTime = 0;
    fly.play();
  } else if (event.keyCode == 40 && startStop == 1) {
    bY = bY + 10;
    fly.currentTime = 0;
    fly.play();
  }
}

//pipe coordinates

let pipe = [];

pipe[0] = {
  x: cvs.width,
  y: 0
};

//detection
let score = 100;

//Listener for start stop button
let startGame = document.querySelector("#startGame");

startGame.addEventListener("click", runGame);

function runGame() {
  if (startStop == 1) {
    startStop = 0;
  } else {
    location.reload();
  }
}

function cancelDraw() {
  cancelAnimationFrame(draw);
}

function draw() {
  ctx.drawImage(bg, 0, 0);

  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";

  for (let i = 0; i < pipe.length; i++) {
    constant = pipeNorth.height + gap;
    ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

    pipe[i].x--;

    if (pipe[i].x == 124) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
      });
    }

    //detect collision

    if (
      bX + bird.width >= pipe[i].x &&
      bX + bird.width <= pipe[i].x + 1 &&
      (bY <= pipe[i].y + pipeNorth.height ||
        bY + bird.height >= pipe[i].y + constant)
    ) {
      startStop = 0;
      continue;
    }

    if (
      bY <= pipe[i].y + pipeNorth.height &&
      bX + bird.width >= pipe[i].x &&
      bX <= pipe[i].x + pipeNorth.width
    ) {
      bY = pipe[i].y + pipeNorth.height;
      score--;
      if (score == 0) {
        startStop = 0;
      }
    }

    if (
      bY + bird.height >= pipe[i].y + constant &&
      bX + bird.width >= pipe[i].x &&
      bX <= pipe[i].x + pipeNorth.width
    ) {
      bY = pipe[i].y + constant - bird.height;
      score--;
      if (score == 0) {
        startStop = 0;
      }
    }
  }

  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.drawImage(bird, bX, bY);
  bY += gravity;
  //ctx.drawImage(pipeNorth,0,pipeNorth.height);
  ctx.fillText(
    "Pipes Done: " + (pipe.length - 2 < 0 ? 0 : pipe.length - 2),
    10,
    cvs.height - 50
  );
  //play Score

  if (pipe.length - 2 > 0 && pipe.length > zzz) {
    scors.play();
  }
  zzz = pipe.length;

  if (score <= 20) {
    ctx.fillStyle = "red";
  }
  ctx.fillText("Life Left: " + score, 10, cvs.height - 20);
  //ctx.fillText("Touch: " + score, 10, cvs.height-20);

  if (bY + bird.height >= cvs.height - fg.height) {
    bY = cvs.height - fg.height - bird.height;
  }
  if (bY <= 0) {
    bY = 0;
  }

  if (startStop == 1) {
    requestAnimationFrame(draw);
  } else {
    ctx.drawImage(gameOver, 100, 100);
    cancelAnimationFrame(draw);
  }
}

draw();
