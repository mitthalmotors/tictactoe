const statusDisplay = document.getElementById('status');
const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const restartButton = document.getElementById('restart');
const turnIndicator = document.getElementById('turn-indicator');
const infoPanel = document.querySelector('.info-panel');
const turnChip = turnIndicator?.closest('.meta-chip');

let computerTurnTimeout = null;

const HUMAN_PLAYER = '🐶';
const COMPUTER_PLAYER = '🐱';
const COMPUTER_MOVE_DELAY_MIN = 280;
const COMPUTER_MOVE_DELAY_MAX = 520;

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

let currentPlayer = HUMAN_PLAYER;
let gameActive = true;
let gameState = Array(9).fill('');
let isComputerThinking = false;

function updateStatus(message, state = 'playing') {
  statusDisplay.textContent = message;
  statusDisplay.dataset.state = state;
  statusDisplay.classList.remove('status-bump');
  void statusDisplay.offsetWidth;
  statusDisplay.classList.add('status-bump');
}

function updateTurnIndicator() {
  const isHumanTurn = gameActive && currentPlayer === HUMAN_PLAYER && !isComputerThinking;
  const isComputerTurn = gameActive && currentPlayer === COMPUTER_PLAYER;

  if (!gameActive) {
    turnIndicator.textContent = 'Game over';
  } else if (isComputerThinking) {
    turnIndicator.textContent = 'Computer ⭕ thinking';
  } else {
    turnIndicator.textContent = currentPlayer === HUMAN_PLAYER ? 'Player ❌' : 'Computer ⭕';
  }

  document.body.classList.toggle('turn-human', isHumanTurn);
  document.body.classList.toggle('turn-computer', isComputerTurn);
  document.body.classList.toggle('is-thinking', isComputerThinking);
  board.classList.toggle('board-locked', isComputerThinking || !gameActive);

  if (turnChip) {
    turnChip.classList.toggle('is-human-turn', isHumanTurn);
    turnChip.classList.toggle('is-computer-turn', isComputerTurn);
    turnChip.classList.toggle('is-thinking', isComputerThinking);
    turnChip.classList.toggle('is-game-over', !gameActive);
  }

  if (infoPanel) {
    infoPanel.classList.toggle('is-thinking', isComputerThinking);
    infoPanel.classList.toggle('is-game-over', !gameActive);
  }
}

function setBoardInteractivity() {
  cells.forEach((cell, index) => {
    const shouldDisable = !gameActive || isComputerThinking || Boolean(gameState[index]);
    cell.disabled = shouldDisable;
  });
}

function getWinningCombination(state) {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return combination;
    }
  }

  return null;
}

function highlightWinningCells(combination) {
  cells.forEach((cell) => cell.classList.remove('is-winning-cell'));

  if (!combination) {
    return;
  }

  combination.forEach((index) => {
    cells[index].classList.add('is-winning-cell');
  });
}

function endGame(message, state = 'finished', winningCombination = null) {
  gameActive = false;
  isComputerThinking = false;
  if (computerTurnTimeout) {
    window.clearTimeout(computerTurnTimeout);
    computerTurnTimeout = null;
  }
  highlightWinningCells(winningCombination);
  updateStatus(message, state);
  updateTurnIndicator();
  setBoardInteractivity();
}

function checkWinner() {
  const winningCombination = getWinningCombination(gameState);

  if (winningCombination) {
    const winner = gameState[winningCombination[0]];
    endGame(
      winner === HUMAN_PLAYER ? 'You win!' : 'Computer wins!',
      winner === HUMAN_PLAYER ? 'win' : 'lose',
      winningCombination
    );
    return true;
  }

  if (!gameState.includes('')) {
    endGame("It's a draw!", 'draw');
    return true;
  }

  return false;
}

function placeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;
  cells[index].dataset.player = player === HUMAN_PLAYER ? 'human' : 'computer';
  cells[index].classList.remove('cell-pop');
  void cells[index].offsetWidth;
  cells[index].classList.add('cell-pop');
  setBoardInteractivity();
}

function switchTurn() {
  currentPlayer = currentPlayer === HUMAN_PLAYER ? COMPUTER_PLAYER : HUMAN_PLAYER;
  updateTurnIndicator();
}

function getAvailableMoves(state) {
  return state
    .map((value, index) => (value === '' ? index : null))
    .filter((value) => value !== null);
}

function findBestMove() {
  const availableMoves = getAvailableMoves(gameState);

  for (const move of availableMoves) {
    const testState = [...gameState];
    testState[move] = COMPUTER_PLAYER;
    if (getWinningCombination(testState)) {
      return move;
    }
  }

  for (const move of availableMoves) {
    const testState = [...gameState];
    testState[move] = HUMAN_PLAYER;
    if (getWinningCombination(testState)) {
      return move;
    }
  }

  if (gameState[4] === '') {
    return 4;
  }

  const corners = [0, 2, 6, 8].filter((index) => gameState[index] === '');
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return availableMoves[0];
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

  if (gameState[clickedCellIndex] !== '' || !gameActive || isComputerThinking) {
    return;
  }

  placeMove(clickedCellIndex, currentPlayer);
  if (checkWinner()) {
    return;
  }
  switchTurn();
  if (currentPlayer === COMPUTER_PLAYER) {
    handleComputerMove();
  }
}

function handleComputerMove() {
  isComputerThinking = true;
  updateTurnIndicator();
  setBoardInteractivity();

  computerTurnTimeout = window.setTimeout(() => {
    const bestMove = findBestMove();
    placeMove(bestMove, COMPUTER_PLAYER);
    if (checkWinner()) {
      return;
    }
    switchTurn();
    isComputerThinking = false;
    updateTurnIndicator();
    setBoardInteractivity();
  }, getComputerMoveDelay());
}

function handleRestartGame() {
  gameActive = true;
  isComputerThinking = false;
  currentPlayer = HUMAN_PLAYER;
  gameState = Array(9).fill('');
  updateStatus('Player ❌'s turn');
  updateTurnIndicator();
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('is-winning-cell');
    cell.dataset.player = '';
  });
  setBoardInteractivity();
  if (computerTurnTimeout) {
    window.clearTimeout(computerTurnTimeout);
    computerTurnTimeout = null;
  }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);

updateStatus('Player ❌'s turn');
updateTurnIndicator();
setBoardInteractivity();

function getComputerMoveDelay() {
  const openCells = getAvailableMoves(gameState).length;

  if (openCells >= 8) {
    return COMPUTER_MOVE_DELAY_MAX;
  }

  if (openCells <= 3) {
    return COMPUTER_MOVE_DELAY_MIN;
  }

  return Math.round((COMPUTER_MOVE_DELAY_MIN + COMPUTER_MOVE_DELAY_MAX) / 2);
}

function runComputerTurn() {
  if (!gameActive || currentPlayer !== COMPUTER_PLAYER || isComputerThinking) {
    return;
  }

  isComputerThinking = true;
  updateStatus('Computer is thinking...', 'thinking');
  updateTurnIndicator();
  setBoardInteractivity();

  computerTurnTimeout = window.setTimeout(() => {
    if (!gameActive || currentPlayer !== COMPUTER_PLAYER) {
      isComputerThinking = false;
      computerTurnTimeout = null;
      updateTurnIndicator();
      setBoardInteractivity();
      return;
    }

    const move = findBestMove();

    isComputerThinking = false;
    computerTurnTimeout = null;

    if (move === undefined) {
      if (!checkWinner()) {
        endGame("It's a draw!", 'draw');
      }
      return;
    }

    placeMove(move, COMPUTER_PLAYER);

    if (checkWinner()) {
      return;
    }

    switchTurn();
    updateStatus('Your turn', 'playing');
    setBoardInteractivity();
  }, getComputerMoveDelay());
}

function handleCellClick(event) {
  const cell = event.target.closest('.cell');
  if (!cell || !board.contains(cell)) {
    return;
  }

  const index = Number.parseInt(cell.dataset.cellIndex ?? '', 10);
  const isValidIndex = Number.isInteger(index) && index >= 0 && index < gameState.length;

  if (
    !isValidIndex ||
    !gameActive ||
    isComputerThinking ||
    currentPlayer !== HUMAN_PLAYER ||
    gameState[index]
  ) {
    return;
  }

  placeMove(index, HUMAN_PLAYER);

  if (checkWinner()) {
    return;
  }

  switchTurn();
  runComputerTurn();
}

function restartGame() {
  if (computerTurnTimeout) {
    window.clearTimeout(computerTurnTimeout);
    computerTurnTimeout = null;
  }

  currentPlayer = HUMAN_PLAYER;
  gameActive = true;
  gameState = Array(9).fill('');
  isComputerThinking = false;

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.removeAttribute('data-player');
    cell.classList.remove('is-winning-cell', 'cell-pop');
  });

  board.classList.remove('board-locked');
  updateStatus('Your turn', 'playing');
  updateTurnIndicator();
  setBoardInteractivity();
}

board.addEventListener('click', handleCellClick);
restartButton.addEventListener('click', restartGame);

restartGame();
