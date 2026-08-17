document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const nextGrid = document.querySelector('.next-piece');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const width = 10;
    const height = 20;
    let squares = Array.from(Array(width * height).keys()).map(i => {
        const square = document.createElement('div');
        grid.appendChild(square);
        return square;
    });
    let nextSquares = Array.from(Array(16).keys()).map(i => {
        const square = document.createElement('div');
        nextGrid.appendChild(square);
        return square;
    });

    let timerId;
    let score = 0;
    let currentPosition = 4;
    let currentRotation = 0;
    let nextRandom = 0;
    let isGameOver = false;
    let isPaused = false;

    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    // assign functions to keycodes
    function control(e) {
        if (!isGameOver && !isPaused) {
            if (e.keyCode === 37) {
                moveLeft();
            } else if (e.keyCode === 38) {
                rotate();
            } else if (e.keyCode === 39) {
                moveRight();
            } else if (e.keyCode === 40) {
                moveDown();
            }
        }
        if (e.keyCode === 80) { // 'P' key for pause
            pauseGame();
        }
    }
    document.addEventListener('keyup', control);

    // move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    ///FIX ROTATION OF TETROMINOES
    function checkRotatedPosition(P) {
        P = P[0];
        if ((currentPosition + P) % width === 0) { //check if the piece has gone out of the grid to the left
            if (current.some(index => (currentPosition + index) % width === width - 1)) { //check if the piece has gone out of the grid to the right
                currentPosition += 1;
                return true;
            }
        } else if ((currentPosition + P) % width === width - 1) { //check if the piece has gone out of the grid to the right
            if (current.some(index => (currentPosition + index) % width === 0)) { //check if the piece has gone out of the grid to the left
                currentPosition -= 1;
                return true;
            }
        }
    }

    // rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) { // if the current rotation gets to 4, make it go back to 0
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        checkRotatedPosition(current);
        draw();
    }

    // show up-next tetromino in mini-grid display
    const displayWidth = 4;
    const displaySquares = Array.from(Array(16).keys()).map(i => {
        const square = document.createElement('div');
        nextGrid.appendChild(square);
        return square;
    });
    let displayIndex = 0;

    // the Tetrominoes without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ];

    // choose colors for tetrominoes
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    // display the shape in the mini-grid display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
    }

    // add functionality to the button
    startButton.addEventListener('click', () => {
        if (timerId) {
            pauseGame();
        } else {
            startGame();
        }
    });

    resetButton.addEventListener('click', resetGame);

    function startGame() {
        if (isGameOver) return;
        if (isPaused) {
            isPaused = false;
            draw();
            timerId = setInterval(moveDown, 1000);
            return;
        }
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
    }

    function pauseGame() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            isPaused = true;
            undraw(); // Hide the current piece when paused
        } else {
            startGame();
        }
    }

    function resetGame() {
        clearInterval(timerId);
        timerId = null;
        isGameOver = false;
        isPaused = false;
        score = 0;
        scoreDisplay.innerHTML = score;
        currentPosition = 4;
        currentRotation = 0;
        nextRandom = 0;
        random = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];

        squares.forEach(square => {
            square.classList.remove('tetromino', 'taken');
            square.style.backgroundColor = '';
        });
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });

        // Add 'taken' class to the bottom row to prevent pieces from going below
        for (let i = 0; i < width; i++) {
            const takenDiv = document.createElement('div');
            takenDiv.classList.add('taken');
            grid.appendChild(takenDiv);
            squares.push(takenDiv);
        }

        draw();
        displayShape();
    }

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken', 'tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
            isGameOver = true;
        }
    }

    // Initial setup for the bottom row to act as a 'taken' area
    for (let i = 0; i < width; i++) {
        const takenDiv = document.createElement('div');
        takenDiv.classList.add('taken');
        grid.appendChild(takenDiv);
        squares.push(takenDiv);
    }

    // Initial draw and display
    draw();
    displayShape();
});
