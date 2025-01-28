const rulesScreen = document.getElementById("rules-screen");
const gameScreen = document.getElementById("game-screen");
const grid = document.getElementById("grid");
const status = document.getElementById("status");
const resetGame = document.getElementById("reset-game");
const switchMode = document.getElementById("switch-mode");
const startGame = document.getElementById("start-game");

let board = Array(3).fill(null).map(() => Array(3).fill(null));
let currentPlayer = "Player 1";
let team = { "Player 1": null, "Player 2": null };
let mode = "hotseat";
let gameOver = false;

// Initialize grid
function renderBoard() {
  grid.innerHTML = "";
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      if (cell) {
        cellDiv.classList.add("taken");
        cellDiv.textContent = cell;
      }
      cellDiv.addEventListener("click", () => handleCellClick(i, j));
      grid.appendChild(cellDiv);
    });
  });
}

// Handle cell clicks
function handleCellClick(i, j) {
  if (gameOver || board[i][j]) return;

  if (!team["Player 1"]) {
    team["Player 1"] = currentPlayer === "Player 1" ? "Chicken" : "Crocodile";
    team["Player 2"] = team["Player 1"] === "Chicken" ? "Crocodile" : "Chicken";
  }

  if (!board.flat().some(cell => cell)) {
    board[i][j] = "Egg";
  } else if (board[i][j] === "Egg") {
    board[i][j] = team[currentPlayer];
  } else {
    return;
  }

  if (checkWinner()) {
    status.textContent = `${currentPlayer} wins!`;
    gameOver = true;
    return;
  } else if (board.flat().every(cell => cell)) {
    status.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "Player 1" ? "Player 2" : "Player 1";

  if (mode === "single" && currentPlayer === "Player 2") {
    computerMove();
  }

  renderBoard();
}

// Computer's random move
function computerMove() {
  const emptyCells = [];
  board.forEach((row, i) => row.forEach((cell, j) => {
    if (!cell) emptyCells.push([i, j]);
  }));
  const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  handleCellClick(i, j);
}

// Check for a winner
function checkWinner() {
  const lines = [
    ...board, // Rows
    [0, 1, 2].map(c => board.map(row => row[c])), // Columns
    [[board[0][0], board[1][1], board[2][2]], [board[0][2], board[1][1], board[2][0]]], // Diagonals
  ].flat();

  return lines.some(line => line.every(cell => cell && cell === team[currentPlayer]));
}

// Reset game
resetGame.addEventListener("click", () => {
  board = Array(3).fill(null).map(() => Array(3).fill(null));
  currentPlayer = "Player 1";
  team = { "Player 1": null, "Player 2": null };
  gameOver = false;
  status.textContent = "";
  switchMode.disabled = false;
  renderBoard();
});

// Switch game mode
switchMode.addEventListener("click", () => {
  mode = mode === "hotseat" ? "single" : "hotseat";
  switchMode.textContent = `Mode: ${mode === "hotseat" ? "Hot Seat" : "Single Player"}`;
});

// Start game
startGame.addEventListener("click", () => {
  rulesScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  renderBoard();
});

