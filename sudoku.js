
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const validateBtn = document.getElementById('validate-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const validationResultEl = document.getElementById('validation-result');

    const puzzles = [
        [
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
        [
            [0, 0, 0, 2, 6, 0, 7, 0, 1],
            [6, 8, 0, 0, 7, 0, 0, 9, 0],
            [1, 9, 0, 0, 0, 4, 5, 0, 0],
            [8, 2, 0, 1, 0, 0, 0, 4, 0],
            [0, 0, 4, 6, 0, 2, 9, 0, 0],
            [0, 5, 0, 0, 0, 3, 0, 2, 8],
            [0, 0, 9, 3, 0, 0, 0, 7, 4],
            [0, 4, 0, 0, 5, 0, 0, 3, 6],
            [7, 0, 3, 0, 1, 8, 0, 0, 0]
        ]
    ];

    let currentPuzzle;

    function generatePuzzle() {
        currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        renderBoard(currentPuzzle);
        validationResultEl.textContent = '';
    }

    function renderBoard(puzzle) {
        boardElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('sudoku-cell');
                if ((c + 1) % 3 === 0 && c < 8) {
                    cell.classList.add('col-border');
                }
                if ((r + 1) % 3 === 0 && r < 8) {
                    cell.classList.add('row-border');
                }

                const value = puzzle[r][c];
                if (value !== 0) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = value;
                    input.readOnly = true;
                    cell.appendChild(input);
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = 1;
                    input.max = 9;
                    input.addEventListener('input', handleCellInput);
                    cell.appendChild(input);
                }
                boardElement.appendChild(cell);
            }
        }
    }
    
    function handleCellInput(e) {
        if (e.target.value.length > 1) {
            e.target.value = e.target.value.slice(0, 1);
        }
    }

    function validateSolution() {
        const boardState = getBoardState();
        if (isValidSolution(boardState)) {
            validationResultEl.textContent = 'Congratulations! You solved it!';
            validationResultEl.style.color = 'green';
        } else {
            validationResultEl.textContent = 'Incorrect solution. Keep trying!';
            validationResultEl.style.color = 'red';
        }
    }

    function getBoardState() {
        const board = [];
        const cells = boardElement.children;
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            if (!board[row]) {
                board[row] = [];
            }
            const input = cells[i].querySelector('input');
            board[row].push(input.value ? parseInt(input.value, 10) : 0);
        }
        return board;
    }

    function isValidSolution(board) {
        // Check rows and columns
        for (let i = 0; i < 9; i++) {
            const row = new Set();
            const col = new Set();
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0 || row.has(board[i][j])) return false;
                row.add(board[i][j]);
                if (board[j][i] === 0 || col.has(board[j][i])) return false;
                col.add(board[j][i]);
            }
        }

        // Check 3x3 subgrids
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                const subgrid = new Set();
                for (let r = i; r < i + 3; r++) {
                    for (let c = j; c < j + 3; c++) {
                        if (board[r][c] === 0 || subgrid.has(board[r][c])) return false;
                        subgrid.add(board[r][c]);
                    }
                }
            }
        }

        return true;
    }

    newGameBtn.addEventListener('click', generatePuzzle);
    validateBtn.addEventListener('click', validateSolution);

    // Initial game generation
    generatePuzzle();
});
