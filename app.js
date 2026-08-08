const cells = Array.from(document.querySelectorAll('.cell'));
const boardElement = document.querySelector('.board');
const statusText = document.querySelector('.status-text');
const resetButton = document.querySelector('.reset');

const HUMAN = 'X';
const COMPUTER = 'O';
// computer opponent uses the O mark
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill('');
let isGameOver = false;
let isComputerThinking = false;

function setStatus(message) {
  statusText.textContent = message;
}

function getWinner(currentBoard) {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (
      currentBoard[a] &&
      currentBoard[a] === currentBoard[b] &&
      currentBoard[a] === currentBoard[c]
    ) {
      return { player: currentBoard[a], line };
    }
  }

  return null;
}

function isDraw(currentBoard) {
  return currentBoard.every((cell) => cell !== '');
}

function updateCell(index, player) {
  const cell = cells[index];
  const content = cell.querySelector('span');

  board[index] = player;
  content.textContent = player;
  cell.classList.remove('player-x', 'player-o');
  cell.classList.add(player === HUMAN ? 'player-x' : 'player-o');
  cell.disabled = true;
}

function highlightWinner(line) {
  boardElement.classList.add('game-over');
  line.forEach((index) => cells[index].classList.add('win'));
}

function finishGame(winner) {
  isGameOver = true;
  isComputerThinking = false;
  cells.forEach((cell) => {
    cell.disabled = true;
  });

  if (winner.player === HUMAN) {
    setStatus('You win!');
  } else {
    setStatus('Computer wins!');
  }

  highlightWinner(winner.line);
}

function getAvailableMoves(currentBoard) {
  return currentBoard
    .map((value, index) => (value === '' ? index : null))
    .filter((value) => value !== null);
}

function getComputerMove() {
  const availableMoves = getAvailableMoves(board);

  for (const move of availableMoves) {
    const nextBoard = [...board];
    nextBoard[move] = COMPUTER;
    if (getWinner(nextBoard)) {
      return move;
    }
  }

  for (const move of availableMoves) {
    const nextBoard = [...board];
    nextBoard[move] = HUMAN;
    if (getWinner(nextBoard)) {
      return move;
    }
  }

  if (board[4] === '') {
    return 4;
  }

  const corners = [0, 2, 6, 8].filter((index) => board[index] === '');
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function runComputerTurn() {
  if (isGameOver) {
    return;
  }

  isComputerThinking = true;
  setStatus('Computer is thinking...');
  cells.forEach((cell, index) => {
    if (board[index] === '') {
      cell.disabled = true;
    }
  });

  window.setTimeout(() => {
    const move = getComputerMove();
    updateCell(move, COMPUTER);

    const winner = getWinner(board);
    if (winner) {
      finishGame(winner);
      return;
    }

    if (isDraw(board)) {
      isGameOver = true;
      isComputerThinking = false;
      boardElement.classList.add('game-over');
      setStatus("It's a draw!");
      return;
    }

    isComputerThinking = false;
    setStatus('Your turn');
    cells.forEach((cell, index) => {
      cell.disabled = board[index] !== '';
    });
  }, 500);
}

function handlePlayerMove(event) {
  const cell = event.currentTarget;
  const index = cells.indexOf(cell);

  if (isGameOver || isComputerThinking || board[index] !== '') {
    return;
  }

  updateCell(index, HUMAN);

  const winner = getWinner(board);
  if (winner) {
    finishGame(winner);
    return;
  }

  if (isDraw(board)) {
    isGameOver = true;
    boardElement.classList.add('game-over');
    setStatus("It's a draw!");
    cells.forEach((button) => {
      button.disabled = true;
    });
    return;
  }

  runComputerTurn();
}

function resetGame() {
  board = Array(9).fill('');
  isGameOver = false;
  isComputerThinking = false;
  boardElement.classList.remove('game-over');
  setStatus('Your turn');

  cells.forEach((cell) => {
    cell.disabled = false;
    cell.classList.remove('win', 'player-x', 'player-o');
    cell.querySelector('span').textContent = '';
  });
}

cells.forEach((cell) => {
  cell.addEventListener('click', handlePlayerMove);
});

resetButton.addEventListener('click', resetGame);
resetGame();
