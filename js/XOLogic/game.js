let playerSymbol = '';
let board = [['', '', ''], ['', '', ''], ['', '', '']]
let canPlay = false;

let xRes = document.querySelector("#total-x");
let oRes = document.querySelector("#total-o");
let drawRes = document.querySelector("#total-draw");

document.getElementById('choose-x').addEventListener('click', function () {
    resetGame();
    playerSymbol = 'X';
    startGame();
    updateTurnIndicators();
    canPlay = true;
});

document.getElementById('reset-game').addEventListener('click', function () {
    resetGame();
});

document.getElementById('choose-o').addEventListener('click', function () {
    resetGame();
    playerSymbol = 'O';
    board[1][1] = 'X';
    startGame();
    updateBoard();
    updateTurnIndicators();
    canPlay = true;
});

function updateTurnIndicators() {
    const xWrapper = document.querySelector(".x-wrapper .turn-box");
    const oWrapper = document.querySelector(".o-wrapper .turn-box");

    if (playerSymbol === "X") {
        xWrapper.style.backgroundColor = "#08D9D6";
        oWrapper.style.backgroundColor = "gray";
    } else if (playerSymbol === "O") {
        oWrapper.style.backgroundColor = "#08D9D6";
        xWrapper.style.backgroundColor = "gray";
    } else {
        xWrapper.style.backgroundColor = "gray";
        oWrapper.style.backgroundColor = "gray";
    
    }
}

function startGame() {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', cellClicked);
    })
}

async function cellClicked(event) {
    let row = event.target.getAttribute('data-row');
    let col = event.target.getAttribute('data-col');

    if (board[row][col] === '' && canPlay) {
        board[row][col] = playerSymbol;
        updateBoard();
        updateTurnIndicators();
        canPlay = false;
        await sendBoardToServer();
    }
}

function updateBoard() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.textContent = board[row][col];
        }
    }
}

async function sendBoardToServer() {
    canPlay = false;
    let modifiedBoard = board;
    if (playerSymbol === 'X') {
        // Swap X and O for the AI's logic if the player is X
        modifiedBoard = board.map(row => row.map(swapSymbol));
    }

    // Get AI's move
    let aiResult = aiMove(modifiedBoard);

    // If the player is X, swap X and O back after the AI's move
    if (playerSymbol === 'X') {
        aiResult.board = aiResult.board.map(row => row.map(swapSymbol));
    }

    // Update the board with the AI's move
    board = aiResult.board;

    // Check the game status
    let gameStatus = aiResult.gameStatus;
    if (gameStatus === 'X' || gameStatus === 'O' || gameStatus === 'Tie') {
        console.log(gameStatus);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateBoard();
        if (gameStatus === 'X') {
            xRes.textContent = parseInt(xRes.textContent) + 1;
        } else if (gameStatus === 'O') {
            oRes.textContent = parseInt(oRes.textContent) + 1;
        } else if (gameStatus === 'Tie') {
            console.log("Tie");
            drawRes.textContent = parseInt(drawRes.textContent) + 1;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        canPlay = false;
        resetMatch();
    } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateBoard();
        canPlay = true;
    }
}

function resetMatch() {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    console.log(playerSymbol)
    if (playerSymbol === 'O') {
        board[1][1] = 'X';
    }
    updateBoard();
    canPlay = true;
    updateTurnIndicators();

}

function swapSymbol(cell) {
    if (playerSymbol === 'X') {
        return cell === 'X' ? 'O' : (cell === 'O' ? 'X' : '');
    } else {
        return cell;
    }
}
function resetGame() {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    updateBoard();
    playerSymbol = ''
    canPlay = false;
    xRes.textContent = 0;
    oRes.textContent = 0;
    drawRes.textContent = 0;
    updateTurnIndicators();
}