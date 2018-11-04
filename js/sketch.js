let MIN_SENTENCE_LENGTH = 3;

let TILE_SIZE = 24;
let MIN_WIDTH = TILE_SIZE * (MIN_SENTENCE_LENGTH+2);
let MIN_HEIGHT = MIN_WIDTH;

let CHANCE_IS = 0.3;
let CHANCE_NEGATION = 0.2;
let CHANCE_CONNECTION = 0.2;

let backColor = '#080808';
let accentColor = '#de396b';
let connectorColor = '#fff';
let negationColor = '#c65a9c'
let decorColors = [ '#efe784', '#e75239', '#8c5a9c', '#5a9cd6' ];

let nouns = ['all', 'baba', 'cute', 'ghost', 'keke', 'life', 'love', 'metal', 'poof', 'win', 'w_star', 'you' ];
let verbs = ['is', 'make', 'eat', 'follow'];
let connectors = ['and', 'on'];
let negation = ['not'];
let decor = ['dust', 'star', 'heart'];

let images = [];

let truth = [];
let sparkles = [];

let scale=1;
let truthCol=1, truthRow=1;

function preload() {
    for (let word of concat(connectors, concat(negation, concat(decor, concat(nouns, verbs))))) {
        images[word] = [];
        images[word].push(loadImage('img/'+word+'1.png'));
        images[word].push(loadImage('img/'+word+'2.png'));
    }
}

function setup() {

  let canvas = createCanvas(windowWidth, windowHeight - 4);
  canvas.parent('canvas-holder')

  // disable smoothing
  let context = canvas.elt.getContext('2d');
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  // Handle the info modal
  let modal = document.getElementById('infobox');
  let openBtn = document.getElementById('button-open');
  let closeBtn = document.getElementById('button-close');

  openBtn.onclick = function() {
    modal.style.display = 'block';
  }
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  }
  window.onclick = function(event) {
    if (event.target != modal && event.target != openBtn) {
      modal.style.display = 'none';
    }
  }

  // compute location of the different elements and display
  windowResized();
}

function windowResized() {
  let w = max(windowWidth, (truth.length+2)*TILE_SIZE, MIN_WIDTH);
  // I don't know OK? p5 adds a few pixels to the canvas container and it's annoying me
  let h = max(windowHeight -8, MIN_HEIGHT);
  
  if (w !== width || h !== height) {
    setCanvasSize(w,h);
  }
}

function setCanvasSize(w,h) {
  resizeCanvas(w, h);

  let prevScale = scale;
  let prevTruthCol = truthCol;
  let prevTruthRow = truthRow;

  scale = ceil(max(1,min(w/TILE_SIZE/9, h/TILE_SIZE/9)));

  let numCols = floor(w/TILE_SIZE/scale);
  let numRows = floor(h/TILE_SIZE/scale);

  while((truth.length+2)>numCols) {
    scale--;
    numCols = floor(w/TILE_SIZE/scale);
    numRows = floor(h/TILE_SIZE/scale);
  }

  // pick sentence if it's the first time
  if (!truth || truth.length==0) {
    pickTruth(numCols-2);
  }

  // Place the sentence in the right position
  truthCol = floor(numCols/2 - truth.length/2);
  truthRow = floor(numRows/2);
  for (let i=0; i < truth.length;i++) {
    truth[i].setPosition(truthCol + i, truthRow);
  }
  
  // decorative elements
  if (!sparkles || sparkles.length==0 
    || scale != prevScale
    || prevTruthCol != truthCol || prevTruthRow != truthRow) {
    createDecorElements(numCols, numRows);
  }

  drawTruth();
}

function createDecorElements(numCols, numRows) {
  let col, row;
  sparkles=[];
  for (let i=0;i<random(10)+(numCols*numRows)/10;i++) {
    col = truthCol;
    row = truthRow;
    while (col >=truthCol-1 && col <= truthCol+truth.length &&
      row >=truthRow-1 && row <= truthRow+1) {
      col = floor(random(numCols));
      row = floor(random(numRows))
    }
    sparkles.push(new Sprite(random(decorColors), images[random(decor)],col,row));
  }
}

function pickTruth(maxLength) {
  truth = [];
  let possibleGroups = floor((maxLength-1) / 2);
  let groups = 1;

  for (let i=1; i < possibleGroups; i++) {
    if (random() < CHANCE_CONNECTION) {
      groups++;
    }
  }

  let sizeLeft = maxLength - (groups*2 +1);

  sizeLeft -= pickNoun(sizeLeft>0);
  for (let i = 0; i <groups; i++) {
    pickConnector();
    sizeLeft -= pickNoun(sizeLeft>0);
  }
}

function pickNoun(canNegate) {
  let negate = canNegate && random() < CHANCE_NEGATION
  if (negate) {
    truth.push(new Sprite(negationColor, images[random(negation)]));
  }
  truth.push(new Sprite(accentColor, images[random(nouns)]));
  return negate ? 1 : 0;
}

function pickConnector() {
  let connector = 'is';
  if (random() > CHANCE_IS) {
    connector = random(concat(verbs, connectors));
  }
  truth.push(new Sprite(connectorColor, images[connector]));
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


