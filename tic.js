// Initialize game variables
let board = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
let currentPlayer = 'X';
let gameWon = false;
let gameMode = 'friend';
let botDifficulty = 'beginner';

// Handle board color change
function changeBoardColor(color) {
    const buttons = document.querySelectorAll('.tic-tac-toe button');
    buttons.forEach(button => {
        button.classList.remove('lightblue', 'lightgreen', 'lightpink', 'lightpurple');
        if (color !== 'default') {
            button.classList.add(color);
        }
    });
}

// Handle bot options
function toggleBotOptions(mode) {
    gameMode = mode;
    document.getElementById('botDifficulty').style.display = (mode === 'bot') ? 'block' : 'none';
    resetGame();
}

// Check for win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === board[b] && board[b] === board[c]) {
            return pattern;
        }
    }
    return null;
}

// Bot move handling
function botMove() {
    let emptyIndices = board
        .map((val, index) => val !== 'X' && val !== 'O' ? index : null)
        .filter(index => index !== null);

    if (botDifficulty === 'beginner') {
        const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        markBox(move);
    } else if (botDifficulty === 'medium') {
        const move = getMediumMove(emptyIndices);
        markBox(move);
    } else {
        const move = bestMove('O', 'X'); // Bot is 'O' and Player is 'X'
        markBox(move);
    }
}

// Medium level move
function getMediumMove(emptyIndices) {
    const winningPattern = checkWin();
    if (winningPattern) {
        const move = winningPattern.find(index => board[index] !== 'X' && board[index] !== 'O');
        if (move !== undefined) {
            return move;
        }
    }
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// Best move using Minimax with Alpha-Beta Pruning
function bestMove(bot, player) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] !== 'X' && board[i] !== 'O') {
            const temp = board[i];
            board[i] = bot;
            let score = minimax(board, 0, false, player, bot, -Infinity, Infinity);
            board[i] = temp;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Minimax algorithm with Alpha-Beta Pruning
function minimax(board, depth, isMaximizing, player, bot, alpha, beta) {
    const winner = checkWinnerForMinimax();

    if (winner === bot) return 10 - depth;
    if (winner === player) return depth - 10;
    if (!board.some(val => val !== 'X' && val !== 'O')) return 0; // Draw

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] !== 'X' && board[i] !== 'O') {
                const temp = board[i];
                board[i] = bot;
                let eval = minimax(board, depth + 1, false, player, bot, alpha, beta);
                board[i] = temp;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] !== 'X' && board[i] !== 'O') {
                const temp = board[i];
                board[i] = player;
                let eval = minimax(board, depth + 1, true, player, bot, alpha, beta);
                board[i] = temp;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
}

// Check winner for Minimax
function checkWinnerForMinimax() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Handle marking a box
function markBox(index) {
    if (!gameWon && board[index] !== 'X' && board[index] !== 'O') {
        board[index] = currentPlayer;
        const button = document.getElementById(index);
        button.innerText = currentPlayer;
        button.classList.add(currentPlayer);

        const winningPattern = checkWin();
        if (winningPattern) {
            document.getElementById('status').innerText = `Congratulations! Player ${currentPlayer} has won!`;
            winningPattern.forEach(i => document.getElementById(i).classList.add('blink'));
            updateScore();
            gameWon = true;
        } else if (!board.some(val => val !== 'X' && val !== 'O')) {
            document.getElementById('status').innerText = "It's a draw.";
        } else {
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            if (gameMode === 'bot' && currentPlayer === 'O') {
                setTimeout(botMove, 500);
            }
        }
    }
}

// Update scores
function updateScore() {
    if (currentPlayer === 'X') {
        document.getElementById('playerXWins').innerText = parseInt(document.getElementById('playerXWins').innerText) + 1;
    } else {
        document.getElementById('playerOWins').innerText = parseInt(document.getElementById('playerOWins').innerText) + 1;
    }
}

// Reset game
function resetGame() {
    board = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
    currentPlayer = 'X';
    gameWon = false;
    document.getElementById('status').innerText = '';
    document.querySelectorAll('.tic-tac-toe button').forEach(button => {
        button.innerText = '';
        button.classList.remove('blink', 'X', 'O');
    });
}

// Continue game
function continueGame() {
    resetGame();
}
