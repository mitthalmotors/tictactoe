function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class SudokuGame {
    constructor() {
        this.board = [];
        this.solution = [];
        this.errors = 0;
        this.selectedTile = null;
        this.selectedNum = null;

        this.boardEl = document.getElementById("sudoku-board");
        this.digitsEl = document.getElementById("digits");
        this.errorsEl = document.getElementById("errors");
        this.newGameBtn = document.getElementById("new-game-btn");
        this.solveBtn = document.getElementById("solve-btn");

        if(this.newGameBtn) this.newGameBtn.addEventListener("click", () => this.startGame());
        if(this.solveBtn) this.solveBtn.addEventListener("click", () => this.solveGame());

        this.startGame();
    }

    startGame() {
        this.errors = 0;
        if(this.errorsEl) this.errorsEl.textContent = `Errors: ${this.errors}`;
        this.board = this.generatePuzzle();
        this.solution = JSON.parse(JSON.stringify(this.board));
        this.solve(this.solution);
        this.removeDigits(40);
        this.createBoard();
        this.createDigits();
    }

    generatePuzzle() {
        let board = Array(9).fill(0).map(() => Array(9).fill(0));
        this.fillBoard(board);
        return board;
    }

    fillBoard(board) {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    shuffle(numbers);
                    for (let num of numbers) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (this.fillBoard(board)) {
                                return true;
                            }
                            board[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (this.solve(board)) {
                                return true;
                            }
                            board[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    removeDigits(count) {
        let removed = 0;
        while (removed < count) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                removed++;
            }
        }
    }

    createBoard() {
        if(!this.boardEl) return;
        this.boardEl.innerHTML = "";
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let tile = document.createElement("div");
                tile.id = `${r}-${c}`;
                tile.classList.add("tile");
                if (this.board[r][c] !== 0) {
                    tile.textContent = this.board[r][c];
                    tile.classList.add("tile-start");
                }
                if (r === 2 || r === 5) {
                    tile.classList.add("horizontal-line");
                }
                if (c === 2 || c === 5) {
                    tile.classList.add("vertical-line");
                }
                tile.addEventListener("click", () => this.selectTile(tile));
                this.boardEl.appendChild(tile);
            }
        }
    }

    createDigits() {
        if(!this.digitsEl) return;
        this.digitsEl.innerHTML = "";
        for (let i = 1; i <= 9; i++) {
            let number = document.createElement("div");
            number.id = String(i);
            number.textContent = i;
            number.classList.add("number");
            number.addEventListener("click", () => this.selectNumber(number));
            this.digitsEl.appendChild(number);
        }
    }

    selectTile(tile) {
        if (tile.classList.contains('tile-start')) {
            return;
        }

        if (this.selectedTile) {
            this.selectedTile.classList.remove("tile-selected");
        }
        this.selectedTile = tile;
        this.selectedTile.classList.add("tile-selected");

        if (this.selectedNum) {
            let coords = this.selectedTile.id.split("-");
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            if (this.solution[r][c] == this.selectedNum.id) {
                this.selectedTile.textContent = this.selectedNum.id;
                this.board[r][c] = parseInt(this.selectedNum.id);
            } else {
                this.errors += 1;
                this.errorsEl.textContent = "Errors: " + this.errors;
            }
        }
    }

    selectNumber(number) {
        if (this.selectedNum) {
            this.selectedNum.classList.remove("number-selected");
        }
        this.selectedNum = number;
        this.selectedNum.classList.add("number-selected");
        if (this.selectedTile) {
            this.selectTile(this.selectedTile);
        }
    }

    solveGame() {
        this.board = JSON.parse(JSON.stringify(this.solution));
        this.createBoard();
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        new SudokuGame();
    });
} else {
    module.exports = { isValid };
}
