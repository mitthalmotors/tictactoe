
document.addEventListener('DOMContentLoaded', () => {
    const rollDiceBtn = document.getElementById('rollDice');
    const diceResultDiv = document.getElementById('diceResult');
    const turnDiv = document.getElementById('turn');
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const board = document.querySelector('.game-board');

    let currentPlayer = 1;
    let player1Position = 0;
    let player2Position = 0;
    const boardSize = 100;

    const snakes = {
        17: 7,
        54: 34,
        62: 19,
        64: 60,
        87: 24,
        93: 73,
        95: 75,
        99: 78
    };
    const ladders = {
        1: 38,
        4: 14,
        9: 31,
        21: 42,
        28: 84,
        36: 44,
        51: 67,
        71: 91,
        80: 100
    };

    function createBoard() {
        for (let i = 1; i <= 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${i}`;
            cell.textContent = i;
            board.appendChild(cell);
        }
        // The numbers are filled in reverse order of display
        const cells = Array.from(board.children);
        cells.reverse();
        board.innerHTML = '';
        let row = 10;
        while(cells.length){
            let chunk;
            if(row % 2 === 0){
                chunk = cells.splice(0,10);
                chunk.reverse();
            } else {
                chunk = cells.splice(0,10);
            }
            chunk.forEach(c => board.appendChild(c));
            row--;
        }
    }

    function movePlayer(player, position) {
        const cell = document.getElementById(`cell-${position}`);
        if (cell) {
            player.style.top = `${cell.offsetTop + 5}px`;
            player.style.left = `${cell.offsetLeft + 5}px`;
        }
    }

    function resetGame() {
        player1Position = 0;
        player2Position = 0;
        currentPlayer = 1;
        turnDiv.textContent = "Player 1's Turn";
        diceResultDiv.textContent = '';
        player1.style.top = '465px';
        player1.style.left = '5px';
        player2.style.top = '465px';
        player2.style.left = '5px';
    }

    rollDiceBtn.addEventListener('click', () => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        diceResultDiv.textContent = `Dice: ${diceRoll}`;

        let activePlayer;
        let activePosition;

        if (currentPlayer === 1) {
            activePlayer = player1;
            player1Position += diceRoll;
            if (player1Position > 100) {
                player1Position = 100;
            }
            if (ladders[player1Position]) {
                player1Position = ladders[player1Position];
            } else if (snakes[player1Position]) {
                player1Position = snakes[player1Position];
            }
            activePosition = player1Position;
            movePlayer(activePlayer, activePosition);

            if (player1Position === 100) {
                setTimeout(() => {
                    alert('Player 1 wins!');
                    resetGame();
                }, 500);
            } else {
                currentPlayer = 2;
                turnDiv.textContent = "Player 2's Turn";
            }
        } else {
            activePlayer = player2;
            player2Position += diceRoll;
            if (player2Position > 100) {
                player2Position = 100;
            }
            if (ladders[player2Position]) {
                player2Position = ladders[player2Position];
            } else if (snakes[player2Position]) {
                player2Position = snakes[player2Position];
            }
            activePosition = player2Position;
            movePlayer(activePlayer, activePosition);

            if (player2Position === 100) {
                setTimeout(() => {
                    alert('Player 2 wins!');
                    resetGame();
                }, 500);
            } else {
                currentPlayer = 1;
                turnDiv.textContent = "Player 1's Turn";
            }
        }
    });

    createBoard();
    resetGame();
});
