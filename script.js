const startButton = document.getElementById("start-game");
const resetButton = document.getElementById("reset");
const rules = document.getElementById("rules");
const boardContainer = document.getElementById("board-container");
const statusText = document.getElementById("status");
const boardElement = document.getElementById("board");

let board = Array(3).fill(null).map(() => Array(3).fill(null));
let currentPlayer = "player"; // player or computer
let gameOver = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkWinner = (team) => {
  const winPatterns = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  return winPatterns.some((pattern) =>
    pattern.every(([r, c]) => board[r][c] === team)
  );
};

const renderBoard = () => {
  boardElement.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      if (cell) cellDiv.classList.add(cell);
      cellDiv.dataset.row = r;
      cellDiv.dataset.col = c;
      cellDiv.textContent = cell === "egg" ? "🥚" : cell === "chicken" ? "🐔" : cell === "crocodile" ? "🐊" : "";
      cellDiv.addEventListener("click", () => handlePlayerTurn(r, c));
      boardElement.appendChild(cellDiv);
    });
  });
};

const handlePlayerTurn = (row, col) => {
  if (gameOver || currentPlayer !== "player" || board[row][col] === "chicken" || board[row][col] === "crocodile") return;

  if (board[row][col] === null) {
    board[row][col] = "egg";
  } else if (board[row][col] === "egg") {
    board[row][col] = "chicken";
  }

  currentPlayer = "computer";
  statusText.textContent = "Computer's Turn";
  renderBoard();

  if (checkWinner("chicken")) return endGame("You Win!");

  delay(1000).then(handleComputerTurn);
};

const handleComputerTurn = () => {
  if (gameOver) return;

  const emptyCells = [];
  board.forEach((row, r) => row.forEach((cell, c) => {
    if (cell === null || cell === "egg") emptyCells.push([r, c]);
  }));

  if (emptyCells.length === 0) return endGame("It's a Draw!");

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  if (board[row][col] === null) {
    board[row][col] = "egg";
  } else if (board[row][col] === "egg") {
    board[row][col] = "crocodile";
  }

  if (checkWinner("crocodile")) return endGame("Computer Wins!");

  currentPlayer = "player";
  statusText.textContent = "Your Turn";
  renderBoard();
};

const endGame = (message) => {
  gameOver = true;
  statusText.textContent = message;
};

const resetGame = () => {
  board = Array(3).fill(null).map(() => Array(3).fill(null));
  currentPlayer = "player";
  gameOver = false;
  statusText.textContent = "Your Turn";
  renderBoard();
};

startButton.addEventListener("click", () => {
  rules.classList.add("hidden");
  boardContainer.classList.remove("hidden");
  renderBoard();
});

resetButton.addEventListener("click", resetGame);

