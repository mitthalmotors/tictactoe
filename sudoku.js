document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');

    let currentPuzzle = [];
    let solution = [];

    // Hardcoded for now
    const basePuzzle = [
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
    
    const baseSolution = [
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
        // For now, just copy the hardcoded puzzle
        currentPuzzle = JSON.parse(JSON.stringify(basePuzzle));
        solution = JSON.parse(JSON.stringify(baseSolution));
    }

    function drawBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (currentPuzzle[i][j] !== 0) {
                    cell.textContent = currentPuzzle[i][j];
                    cell.classList.add('pre-filled');
                } else {
                    cell.contentEditable = true;
                    cell.addEventListener('input', (e) => {
                        const text = e.target.textContent;
                        if (!/^[1-9]$/.test(text)) {
                            e.target.textContent = '';
                        }
                    });
                }
                boardElement.appendChild(cell);
            }
        }
    }

    function checkSolution() {
        const cells = boardElement.querySelectorAll('.cell');
        let isCorrect = true;
        cells.forEach(cell => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            const userValue = parseInt(cell.textContent, 10);
            
            if (!cell.classList.contains('pre-filled')) {
                if (isNaN(userValue) || userValue !== solution[row][col]) {
                    cell.style.backgroundColor = '#ffdddd'; // incorrect
                    isCorrect = false;
                } else {
                    cell.style.backgroundColor = '#ddffdd'; // correct
                }
            }
        });

        if (isCorrect) {
            setTimeout(() => alert('Congratulations! You solved it!'), 100);
        }
    }

    function initGame() {
        generatePuzzle();
        drawBoard();
    }

    newGameBtn.addEventListener('click', initGame);
    checkBtn.addEventListener('click', checkSolution);

    initGame();
});
