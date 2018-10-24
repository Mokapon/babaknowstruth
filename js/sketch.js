let TILE_WIDTH = 24;

let backColor = '#080808'
let accentColor = '#de396b'
let colors = [ '#efe784', '#e75239', '#8c5a9c', '#5a9cd6' ]

let words = ['baba', 'you', 'love', 'all', 'life', 'cute']
let verbs = ['is', 'make', 'eat', 'heart']
let decor = ['dust', 'star']

let images = [];

let truth = [];
let sparkles = [];

let w, h, truthCol=1, truthRow=1, scale=1;

function preload() {
    for (let word of concat(decor, concat(words, verbs))) {
        images[word] = [];
        images[word].push(loadImage('img/'+word+'1.png'));
        images[word].push(loadImage('img/'+word+'2.png'));
    }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 4);
  canvas.parent('canvas-holder')
  // create canvas and disable smoothing
  let context = canvas.elt.getContext('2d');
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  // Handle the info modal
  let modal = document.getElementById('infobox');
  
  let openBtn = document.getElementById('button-open');
  let closeBtn = document.getElementById('button-close');

  // When the user clicks the button, open the modal 
  openBtn.onclick = function() {
    modal.style.display = 'block';
  }

  // When the user clicks on <span> (x), close the modal
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target != modal && event.target != openBtn) {
      modal.style.display = 'none';
    }
  }

  // compute location of the different elements and display
  windowResized();

  noStroke();

}

function windowResized() {
  w = windowWidth;
  // I don't know OK? p5 adds 4 pixels to the container and it's annoying me
  h = windowHeight -40;
  resizeCanvas(w, h);

  let prevScale = scale;
  let prevTruthCol = truthCol;
  let prevTruthRow = truthRow;

  scale = ceil(max(1,min(w/TILE_WIDTH/9, h/TILE_WIDTH/9)));

  let numCols = floor(w/TILE_WIDTH/scale);
  let numRows = floor(h/TILE_WIDTH/scale);

  truthCol = floor(numCols/2-1);
  truthRow = floor(numRows/2);
  
  // decorative elements
  if (!sparkles || sparkles.length==0 
    || scale != prevScale
    || prevTruthCol != truthCol || prevTruthRow != truthRow) {
    let col, row;
    sparkles=[];
    for (let i=0;i<random(10)+(numCols*numRows)/10;i++) {
      col = truthCol;
      row = truthRow;
      while (col >=truthCol-1 && col <= truthCol+3 &&
        row >=truthRow-1 && row <= truthRow+1) {
        col = floor(random(numCols));
        row = floor(random(numRows))
      }
      sparkles.push(new Sprite(col,row,random(colors), images[random(decor)]));
    }
  }

  // words
  if (!truth || truth.length==0) {
    pickTruth(truthCol, truthRow);
  } else {
    for (let i=0;i<truth.length;i++) {
      truth[i].x = truthCol + i;
      truth[i].y = truthRow;
    }
  }

  drawTruth();
}

function pickTruth(col, row) {
  truth = [];
  truth.push(new Sprite(col, row, accentColor, images[random(words)]));
  truth.push(new Sprite(col+1, row, '#fff', images[random(verbs)]));
  truth.push(new Sprite(col+2, row, accentColor, images[random(words)]));
}

function draw() {
  // Update sprites
  if (frameCount%30==0) {
    for (let sprite of concat(truth, sparkles)) {
      sprite.tick();
    }
    drawTruth();
  }
}

function drawTruth() {
  background(backColor)
  for (let sprite of concat(truth, sparkles)) {
    sprite.draw();
  }
  
}


