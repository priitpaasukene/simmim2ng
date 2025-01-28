document.addEventListener('DOMContentLoaded', () => {
    const rulesScreen = document.getElementById('rules-screen');
    const gameScreen = document.getElementById('game-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const resetGameBtn = document.getElementById('reset-game-btn');
    const board = document.getElementById('board');
    const statusText = document.getElementById('status');

    let gameState;
    const PLAYER = 'chicken';
    const COMPUTER = 'crocodile';

    startGameBtn.addEventListener('click', startGame);
    resetGameBtn.addEventListener('click', resetGame);

    function startGame() {
        rulesScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        resetGame();
    }

    function resetGame() {
        gameState = {
            board: Array(9).fill(null),
            currentPlayer: PLAYER,
            gameOver: false,
        };
        renderBoard();
        statusText.textContent = "Your turn!";
    }

    function renderBoard() {
        board.innerHTML = '';
        gameState.board.forEach((cell, index) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            if (cell) cellDiv.classList.add(cell);
            cellDiv.dataset.index = index;
            board.appendChild(cellDiv);
        });
        board.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', handlePlayerTurn);
        });
    }

    function handlePlayerTurn(e) {
        if (gameState.gameOver || gameState.currentPlayer !== PLAYER) return;
        const index = +e.target.dataset.index;

        if (gameState.board[index] === null) {
            gameState.board[index] = 'egg';
            endTurn();
        } else if (gameState.board[index] === 'egg') {
            gameState.board[index] = PLAYER;
            endTurn();
        }
    }

    function endTurn() {
        renderBoard();
        if (checkWin(PLAYER)) {
            statusText.textContent = "You win!";
            gameState.gameOver = true;
        } else if (gameState.board.every(cell => cell !== null)) {
            statusText.textContent = "It's a draw!";
            gameState.gameOver = true;
        } else {
            gameState.currentPlayer = gameState.currentPlayer === PLAYER ? COMPUTER : PLAYER;
            if (gameState.currentPlayer === COMPUTER) {
                statusText.textContent = "Computer's turn...";
                setTimeout(computerTurn, 1000);
            } else {
                statusText.textContent = "Your turn!";
            }
        }
    }

    function computerTurn() {
        const emptyIndices = gameState.board
            .map((cell, index) => (cell === null ? index : null))
            .filter(index => index !== null);
        const eggIndices = gameState.board
            .map((cell, index) => (cell === 'egg' ? index : null))
            .filter(index => index !== null);

        let move;
        if (emptyIndices.length > 0) {
            move = emptyIndices[Math.floor(Math.random() *

