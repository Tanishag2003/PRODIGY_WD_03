let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Start with Player X
let isGameActive = false;
let gameMode = 'user'; // Default game mode is Player vs Player
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const statusDisplay = document.getElementById('game-status');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart-button');
const startGameButton = document.getElementById('start-game-button');
const gameBoardContainer = document.getElementById('game-board-container');

// Display current player turn
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

// Display winner message
const winningMessage = () => `Player ${currentPlayer} has won!`;

// Display draw message
const drawMessage = () => `It's a draw!`;

// Update game status text
statusDisplay.textContent = currentPlayerTurn();

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Prevent action if cell is already filled or game is inactive
    if (board[clickedCellIndex] !== '' || !isGameActive) {
        return;
    }

    // Update cell and check result
    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    // If playing against AI and it's AI's turn, let the AI make a move
    if (gameMode === 'ai' && isGameActive && currentPlayer === 'O') {
        setTimeout(handleAIMove, 500); // Delay AI's move for better UX
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = currentPlayerTurn();
}

function checkResult() {
    let roundWon = false;

    // Check winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = winningMessage();
        isGameActive = false; // Stop the game
        return;
    }

    if (!board.includes('')) {
        statusDisplay.textContent = drawMessage();
        isGameActive = false; // Stop the game
        return;
    }

    changePlayer(); // Change player after each move
}

function handleAIMove() {
    // Simple AI logic: Pick a random empty cell
    const emptyCells = board.map((value, index) => (value === '' ? index : null)).filter(index => index !== null);
    
    // If no empty cells are available, return
    if (emptyCells.length === 0) {
        return;
    }

    // Pick a random empty cell
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const aiCell = document.querySelector(`.cell[data-index='${randomIndex}']`);

    updateCell(aiCell, randomIndex);
    checkResult();
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true; // Start a new game
    currentPlayer = 'X'; // Set initial player
    statusDisplay.textContent = currentPlayerTurn();
    cells.forEach(cell => cell.textContent = ''); // Clear the cells
}

function startGame() {
    gameMode = document.getElementById('game-mode').value; // Get selected game mode
    restartGame(); // Initialize the game
    gameBoardContainer.style.display = 'block'; // Show the game board
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
startGameButton.addEventListener('click', startGame);
