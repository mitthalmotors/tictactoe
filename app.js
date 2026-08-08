const statusDisplay = document.getElementById('status');
const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const restartButton = document.getElementById('restart');

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');

function updateStatus(message) {
  statusDisplay.textContent = message;
}

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (!gameState[a] || gameState[a] !== gameState[b] || gameState[a] !== gameState[c]) {
      continue;
    }

    gameActive = false;
    updateStatus(`Player ${gameState[a]} wins!`);
    cells.forEach((cell) => {
      cell.disabled = true;
    });
    return true;
  }

  if (!gameState.includes('')) {
    gameActive = false;
    updateStatus("It's a draw!");
    return true;
  }

  return false;
}

function handleCellClick(event) {
  const cell = event.target;
  const index = Number(cell.dataset.cellIndex);

  if (!gameActive || gameState[index]) {
    return;
  }

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.disabled = true;

  if (checkWinner()) {
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function restartGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = Array(9).fill('');
  updateStatus("Player X's turn");

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
  });
}

board.addEventListener('click', handleCellClick);
restartButton.addEventListener('click', restartGame);

updateStatus("Player X's turn");
