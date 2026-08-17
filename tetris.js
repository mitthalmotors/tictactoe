// tetris.js

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30; // Size of each block in pixels

const SHAPES = [
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
  [[0, 1, 0], [1, 1, 1], [0, 0, 0]], // T
  [[0, 1, 1], [1, 1, 0], [0, 0, 0]], // S
  [[1, 1, 0], [0, 1, 1], [0, 0, 0]], // Z
  [[1, 0, 0], [1, 1, 1], [0, 0, 0]], // J
  [[0, 0, 1], [1, 1, 1], [0, 0, 0]], // L
  [[1, 1], [1, 1]] // O
];

const COLORS = [
  'cyan', 'purple', 'green', 'red', 'blue', 'orange', 'yellow'
];

let canvas;
let ctx;
let board;
let currentPiece;
let currentX, currentY;
let score = 0;
let gameOver = false;
let gameInterval;

// Initialize the game
function init() {
  canvas = document.getElementById('tetrisCanvas');
  ctx = canvas.getContext('2d');

  canvas.width = COLS * BLOCK_SIZE;
  canvas.height = ROWS * BLOCK_SIZE;

  ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

  board = createBoard();
  newPiece();
  gameInterval = setInterval(gameLoop, 500); // Piece drops every 500ms

  document.addEventListener('keydown', handleKeyPress);
  updateScore();
}

// Create an empty game board
function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Generate a new random piece
function newPiece() {
  const randShape = Math.floor(Math.random() * SHAPES.length);
  currentPiece = SHAPES[randShape];
  currentX = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
  currentY = 0;

  if (checkCollision(board, currentPiece, currentX, currentY)) {
    gameOver = true;
    clearInterval(gameInterval);
    alert('Game Over! Score: ' + score);
  }
}

// Draw a piece on the board
function drawPiece(piece, x, y, colorIndex) {
  piece.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value > 0) {
        ctx.fillStyle = COLORS[colorIndex];
        ctx.fillRect(x + c, y + r, 1, 1);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x + c, y + r, 1, 1);
      }
    });
  });
}

// Draw the entire board
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value > 0) {
        ctx.fillStyle = COLORS[value - 1]; // value 1-7 corresponds to COLORS 0-6
        ctx.fillRect(c, r, 1, 1);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(c, r, 1, 1);
      }
    });
  });

  // Draw the current falling piece
  if (currentPiece && !gameOver) {
    const colorIndex = SHAPES.indexOf(currentPiece);
    drawPiece(currentPiece, currentX, currentY, colorIndex);
  }
}

// Check for collision
function checkCollision(board, piece, x, y) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece[r].length; c++) {
      if (piece[r][c] > 0) {
        const boardX = x + c;
        const boardY = y + r;

        if (
          boardX < 0 ||
          boardX >= COLS ||
          boardY >= ROWS ||
          (boardY >= 0 && board[boardY][boardX] > 0)
        ) {
          return true;
        }
      }
    });
  }
  return false;
}

// Merge piece into the board
function mergePiece() {
  const colorIndex = SHAPES.indexOf(currentPiece) + 1; // +1 because 0 is empty
  currentPiece.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value > 0) {
        board[currentY + r][currentX + c] = colorIndex;
      }
    });
  });
}

// Clear full lines
function clearLines() {
  let linesCleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell > 0)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      linesCleared++;
      r++; // Check the new line at the same row index
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100; // Basic scoring
    updateScore();
  }
}

// Rotate the current piece
function rotate(piece) {
  const newPiece = piece[0].map((_, index) => piece.map(row => row[index]).reverse());
  return newPiece;
}

// Handle keyboard input
function handleKeyPress(e) {
  if (gameOver) return;

  switch (e.key) {
    case 'ArrowLeft':
      if (!checkCollision(board, currentPiece, currentX - 1, currentY)) {
        currentX--;
      }
      break;
    case 'ArrowRight':
      if (!checkCollision(board, currentPiece, currentX + 1, currentY)) {
        currentX++;
      }
      break;
    case 'ArrowDown':
      if (!checkCollision(board, currentPiece, currentX, currentY + 1)) {
        currentY++;
      } else {
        lockPiece();
      }
      break;
    case 'ArrowUp': // Rotate
      const rotatedPiece = rotate(currentPiece);
      if (!checkCollision(board, rotatedPiece, currentX, currentY)) {
        currentPiece = rotatedPiece;
      }
      break;
    case ' ': // Spacebar for hard drop
      while (!checkCollision(board, currentPiece, currentX, currentY + 1)) {
        currentY++;
      }
      lockPiece();
      break;
  }
  drawBoard();
}

// Lock piece in place and generate new one
function lockPiece() {
  mergePiece();
  clearLines();
  newPiece();
  drawBoard();
}

// Update score display
function updateScore() {
  document.getElementById('score').innerText = score;
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  if (!checkCollision(board, currentPiece, currentX, currentY + 1)) {
    currentY++;
  } else {
    lockPiece();
  }
  drawBoard();
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Expose for testing if needed
window.tetris = {
  init,
  createBoard,
  newPiece,
  drawPiece,
  drawBoard,
  checkCollision,
  mergePiece,
  clearLines,
  rotate,
  handleKeyPress,
  lockPiece,
  updateScore,
  gameLoop,
  get board() { return board; },
  get currentPiece() { return currentPiece; },
  get currentX() { return currentX; },
  get currentY() { return currentY; },
  get score() { return score; },
  get gameOver() { return gameOver; },
  set gameOver(val) { gameOver = val; },
  set score(val) { score = val; },
  set currentPiece(val) { currentPiece = val; },
  set currentX(val) { currentX = val; },
  set currentY(val) { currentY = val; },
  set board(val) { board = val; },
};
