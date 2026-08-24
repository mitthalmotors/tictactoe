document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('sudoku-board');
  const numberPaletteElement = document.getElementById('number-palette');
  const newGameBtn = document.getElementById('new-game-btn');
  const checkBtn = document.getElementById('check-btn');

  let selectedCell = null;
  let currentPuzzle;
  let currentSolution;

  const puzzles = [
    {
      puzzle: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ]
    },
    {
      puzzle: [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0]
      ],
      solution: [
        [4, 3, 5, 2, 6, 9, 7, 8, 1],
        [6, 8, 2, 5, 7, 1, 4, 9, 3],
        [1, 9, 7, 8, 3, 4, 5, 6, 2],
        [8, 2, 6, 1, 9, 5, 3, 4, 7],
        [3, 7, 4, 6, 8, 2, 9, 1, 5],
        [9, 5, 1, 7, 4, 3, 6, 2, 8],
        [5, 1, 9, 3, 2, 6, 8, 7, 4],
        [2, 4, 8, 9, 5, 7, 1, 3, 6],
        [7, 6, 3, 4, 1, 8, 2, 5, 9]
      ]
    }
  ];

  function generateBoard(puzzle) {
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
        input.setAttribute('type', 'text');
        input.setAttribute('maxlength', '1');
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^1-9]/g, '');
        });
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
    const puzzleIndex = Math.floor(Math.random() * puzzles.length);
    currentPuzzle = puzzles[puzzleIndex].puzzle;
    currentSolution = puzzles[puzzleIndex].solution;
    generateBoard(currentPuzzle);
  }

  function checkSolution() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const input = cell.querySelector('input');
        if (input) {
            const userValue = parseInt(input.value, 10);
            if (userValue === currentSolution[row][col]) {
                input.classList.remove('incorrect');
                input.classList.add('correct');
            } else {
                input.classList.add('incorrect');
            }
        }
    });
  }

  newGameBtn.addEventListener('click', newGame);
  checkBtn.addEventListener('click', checkSolution);

  newGame(); // Initial game setup
  generateNumberPalette();
});
