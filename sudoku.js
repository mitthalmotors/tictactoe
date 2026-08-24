document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('sudoku-board');
  const numberPaletteElement = document.getElementById('number-palette');
  const newGameBtn = document.getElementById('new-game-btn');
  const checkBtn = document.getElementById('check-btn');

  let selectedCell = null;
  let selectedNumber = null;

  // A simple puzzle and its solution
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  function generateBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 81; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const row = Math.floor(i / 9);
      const col = i % 9;

      const value = puzzle[row][col];
      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add('given');
      } else {
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('min', '1');
        input.setAttribute('max', '9');
        input.addEventListener('focus', () => {
            selectedCell = input;
        });
        cell.appendChild(input);
      }
      boardElement.appendChild(cell);
    }
  }

  function generateNumberPalette() {
    numberPaletteElement.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
      const number = document.createElement('div');
      number.classList.add('number');
      number.textContent = i;
      number.addEventListener('click', () => {
        if (selectedCell) {
          selectedCell.value = i;
        }
      });
      numberPaletteElement.appendChild(number);
    }
  }

  function newGame() {
    generateBoard();
    // In a real game, you would generate or fetch a new puzzle.
    // For now, we just reset the board with the same puzzle.
  }

  function checkSolution() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const input = cell.querySelector('input');
        if (input) {
            const userValue = parseInt(input.value, 10);
            if (userValue === solution[row][col]) {
                input.classList.remove('incorrect');
            } else {
                input.classList.add('incorrect');
            }
        }
    });
  }

  newGameBtn.addEventListener('click', newGame);
  checkBtn.addEventListener('click', checkSolution);

  generateBoard();
  generateNumberPalette();
});
