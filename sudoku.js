document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkSolutionBtn = document.getElementById('check-solution-btn');
    const resultMessage = document.getElementById('result-message');

    let currentPuzzle = {};

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

    function generatePuzzle() {
        const puzzle = JSON.parse(JSON.stringify(solution)); // Deep copy
        const empties = 40; // Number of cells to empty
        for (let i = 0; i < empties; i++) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            while (puzzle[row][col] === 0) {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            }
            puzzle[row][col] = 0;
        }
        return { puzzle, solution };
    }

    function drawBoard(puzzle) {
        grid.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('input');
                                cell.type = 'number';
                cell.pattern = '[1-9]';
                cell.maxLength = 1;
                cell.min = 1;
                cell.max = 9;
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (r === 2 || r === 5) {
                    cell.classList.add('border-bottom');
                }
                if (c === 2 || c === 5) {
                    cell.classList.add('border-right');
                }

                if (puzzle[r][c] !== 0) {
                    cell.value = puzzle[r][c];
                    cell.readOnly = true;
                }
                grid.appendChild(cell);
            }
        }
    }

    function newGame() {
        currentPuzzle = generatePuzzle();
        drawBoard(currentPuzzle.puzzle);
        resultMessage.textContent = '';
    }

    function checkSolution() {
        const inputs = grid.getElementsByTagName('input');
        let isCorrect = true;
        for (const input of inputs) {
            const r = input.dataset.row;
            const c = input.dataset.col;
            if (!input.value || parseInt(input.value) !== currentPuzzle.solution[r][c]) {
                isCorrect = false;
                break;
            }
        }
        resultMessage.textContent = isCorrect ? 'Congratulations! You solved it!' : 'Something is not quite right. Keep trying!';
    }

    newGame(); // Start a new game on page load

    newGameBtn.addEventListener('click', newGame);
    checkSolutionBtn.addEventListener('click', checkSolution);

    grid.addEventListener('input', (e) => {
        const input = e.target;
        if (input.tagName === 'INPUT') {
            const value = input.value;
            if (!/^[1-9]$/.test(value)) {
                input.value = '';
            }
        }
    });
});
