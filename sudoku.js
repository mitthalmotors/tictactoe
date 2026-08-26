
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

let board;
let selectedCell = null;

function isValid(board, row, col, num) {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (board[row][c] === num && c !== col) {
            return false;
        }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        if (board[r][col] === num && r !== row) {
            return false;
        }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const newRow = startRow + r;
            const newCol = startCol + c;
            if (board[newRow][newCol] === num && (newRow !== row || newCol !== col)) {
                return false;
            }
        }
    }

    return true;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const boardElement = document.getElementById('sudoku-board');
        const numberPalette = document.getElementById('number-palette');
        const newGameBtn = document.getElementById('new-game-btn');
        const checkSolutionBtn = document.getElementById('check-solution-btn');
        const resultMessage = document.getElementById('result-message');

        function drawBoard() {
            boardElement.innerHTML = '';
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    if (board[r][c] !== 0) {
                        cell.textContent = board[r][c];
                        if (initialPuzzle[r][c] !== 0) {
                            cell.classList.add('pre-filled');
                        }
                    } else {
                        cell.addEventListener('click', () => selectCellUI(cell));
                    }
                    if ((c + 1) % 3 === 0 && c < 8) {
                        cell.style.borderRight = '2px solid black';
                    }
                    if ((r + 1) % 3 === 0 && r < 8) {
                        cell.style.borderBottom = '2px solid black';
                    }
                    boardElement.appendChild(cell);
                }
            }
        }

        function createNumberPalette() {
            for (let i = 1; i <= 9; i++) {
                const number = document.createElement('div');
                number.classList.add('number');
                number.textContent = i;
                number.addEventListener('click', () => selectNumberUI(number));
                numberPalette.appendChild(number);
            }
        }

        function selectCellUI(cell) {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = cell;
            selectedCell.classList.add('selected');
        }

        function selectNumberUI(number) {
            if (selectedCell) {
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                const num = parseInt(number.textContent);

                const tempBoard = board.map(row => row.slice());
                tempBoard[row][col] = num;

                if (isValid(tempBoard, row, col, num)) {
                    board[row][col] = num;
                    selectedCell.textContent = num;
                    resultMessage.textContent = '';
                } else {
                    resultMessage.textContent = 'Invalid move!';
                    // Optionally, revert the cell content if you want to show the error and then clear it
                    // setTimeout(() => { resultMessage.textContent = ''; }, 1000);
                }
            }
        }

        function checkSolution() {
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    const num = board[r][c];
                    if (num === 0 || !isValid(board, r, c, num)) {
                        resultMessage.textContent = 'Incomplete or incorrect solution!';
                        return;
                    }
                }
            }
            resultMessage.textContent = 'Congratulations! You solved it!';
        }

        function startNewGame() {
            board = initialPuzzle.map(row => row.slice());
            drawBoard();
            resultMessage.textContent = '';
        }

        newGameBtn.addEventListener('click', startNewGame);
        checkSolutionBtn.addEventListener('click', checkSolution);

        startNewGame();
        createNumberPalette();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isValid };
}
