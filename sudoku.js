document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');

    const initialPuzzle = [
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

    let currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));

    function generatePuzzle() {
        // For now, we'll just reset to the initial puzzle.
        // A real implementation would generate a new puzzle.
        currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
        createBoard();
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;

                if ((j + 1) % 3 === 0 && j < 8) {
                    cell.classList.add('border-right');
                }
                if ((i + 1) % 3 === 0 && i < 8) {
                    cell.classList.add('border-bottom');
                }

                if (currentPuzzle[i][j] !== 0) {
                    cell.textContent = currentPuzzle[i][j];
                    cell.classList.add('given');
                } else {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'number');
                    input.setAttribute('min', '1');
                    input.setAttribute('max', '9');
                    input.addEventListener('input', (e) => handleInput(e, i, j));
                    cell.appendChild(input);
                }
                gameBoard.appendChild(cell);
            }
        }
    }

    function handleInput(e, row, col) {
        const value = parseInt(e.target.value);
        if (isValid(value, row, col)) {
            currentPuzzle[row][col] = value;
            e.target.classList.remove('invalid');
        } else {
            e.target.classList.add('invalid');
        }
    }

    function isValid(num, row, col) {
        if (isNaN(num) || num < 1 || num > 9) return false;

        // Check row
        for (let i = 0; i < 9; i++) {
            if (currentPuzzle[row][i] === num && i !== col) {
                return false;
            }
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (currentPuzzle[i][col] === num && i !== row) {
                return false;
            }
        }

        // Check 3x3 subgrid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (currentPuzzle[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) {
                    return false;
                }
            }
        }

        return true;
    }

    function checkSolution() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = gameBoard.children[i * 9 + j];
                const input = cell.querySelector('input');
                if (input) {
                    const value = parseInt(input.value);
                    if (!isValid(value, i, j)) {
                        input.classList.add('invalid');
                    } else {
                        input.classList.remove('invalid');
                    }
                }
            }
        }
        // A more complete check would confirm the puzzle is solved.
        alert('Check complete. Invalid cells are marked in red.');
    }

    newGameBtn.addEventListener('click', generatePuzzle);
    checkBtn.addEventListener('click', checkSolution);

    generatePuzzle();
});
