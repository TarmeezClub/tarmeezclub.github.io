let playerSymbol = '';
let board = [['', '', ''], ['', '', ''], ['', '', '']]
let canPlay = false;
let flawHappend = true;
let isImpossibleMode = true; // when this is true: IT IS IMPOSSIBLE TO WIN!
let xRes = document.querySelector("#total-x");
let oRes = document.querySelector("#total-o");
let drawRes = document.querySelector("#total-draw");

// create a button to change the game mode after that unComment the event listener
document.getElementById('game-mode').addEventListener('click', function () {
    resetGame();
    changeContent();
    isImpossibleMode = !isImpossibleMode;
});

document.getElementById('choose-x').addEventListener('click', function () {
    resetGame();
    playerSymbol = 'X';
    flawActivasion();
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
    flawActivasion();
    board[1][1] = 'X';
    startGame();
    updateBoard();
    updateTurnIndicators();
    canPlay = true;
});

function flawActivasion() {
    // here we will make a 20% chance for the flaw to happen if player is x, otherwise 50%
    let randomNumber = Math.random()
    if (!isImpossibleMode && (randomNumber < (playerSymbol === 'X' ? 0.2 : 0.5))) {
        // console.log("Hah Yeah you deserve to win :D")
        flawHappend = false;
    } else {
        flawHappend = true;
    }
}

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
    // flawActivasion();
    document.querySelector('.choose-plyer-first').classList.add('hide');
    document.querySelector('.turn-both').classList.remove('before-play');
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', cellClicked);
    })
}

async function cellClicked(event) {
    let row = event.target.getAttribute('data-row');
    let col = event.target.getAttribute('data-col');

    if ((board[row][col] === '' || board[row][col] === '-') && canPlay) {
        board[row][col] = playerSymbol;
        updateBoard();
        updateTurnIndicators();
        canPlay = false;
        let emptyIncludeDash = flawInCountEmptyNodes(board)
        // console.log(emptyIncludeDash)
        if (emptyIncludeDash.length === 1) {
            let indx = emptyIncludeDash[0];
            board[Math.floor(indx / 3)][indx % 3] = '';
        }
        await sendBoardToServer();
    }
}

function updateBoard() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.textContent = board[row][col] !== '-' ? board[row][col] : '';
        }
    }
}

function getGameStatus(board) {
    if (checkWin("X", board)) {
        return swapSymbol("X");
    }
    else if (checkWin("O", board)) {
        return swapSymbol("O");
    }
    else if (flawInCountEmptyNodes(board).length === 0) {
        return "Tie";
    } else {
        return "on going";
    }
}

async function sendBoardToServer() {
    // console.log(flawHappend)
    canPlay = false;
    let modifiedBoard = board;
    let gameStatus = getGameStatus(board);
    

    if (playerSymbol === 'X') {
        // Swap X and O for the AI's logic if the player is X
        modifiedBoard = board.map(row => row.map(swapSymbol));
    }

    // Get AI's move
    if (playerSymbol === 'X') {
        modifiedBoard = makeDeterminedFlaw(modifiedBoard)
    }
    if (gameStatus === "on going") {
        let aiResult = aiMove(modifiedBoard);

        // If the player is X, swap X and O back after the AI's move
        aiResult.board = aiResult.board.map(row => row.map(swapSymbol));

        // Update the board with the AI's move
        board = aiResult.board;
        if (playerSymbol === 'O') {
            board = makeDeterminedFlaw(board)
        }
    }

    // Check the game status
    gameStatus = getGameStatus(board);
    // console.log(gameStatus);
    let isUserWon = playerSymbol === swapSymbol(gameStatus)
    if (gameStatus === 'X' || gameStatus === 'O' || gameStatus === 'Tie') {
        // console.log("Result", gameStatus);
        // console.log("isUserWon: ", isUserWon)
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!isUserWon) {
            updateBoard();
        }
        if (swapSymbol(gameStatus) === 'X') {
            xRes.textContent = parseInt(xRes.textContent) + 1;
        } else if (swapSymbol(gameStatus) === 'O') {
            oRes.textContent = parseInt(oRes.textContent) + 1;
        } else if (gameStatus === 'Tie') {
            drawRes.textContent = parseInt(drawRes.textContent) + 1;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        canPlay = false;
        // stop some time to check result 
        // setTimeout(resetMatch,1000)
        resetMatch();
    } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateBoard();
        canPlay = true;
    }
}

function flawInCountEmptyNodes(board) {
    let states = [];
    for (let i = 0; i < 9; i++) {
        if (board[Math.floor(i / 3)][i % 3] === '' || board[Math.floor(i / 3)][i % 3] === '-') states.push(i);
    }
    return states;
}

function makeDeterminedFlaw(board) {
    let randomPlaces = emptyNodes(board)
    let difficulty = 6; // range from 2 to 8
    // the more the difficulty the more the flaw, 5 is harder than 8
    // because the flaw will happen early in the begginning of the game
    // 3 or 2 would be so hard and rare to win
    if (!flawHappend && (randomPlaces.length <= difficulty)) {
        let indexOfFlaw = randomPlaces[Math.floor(Math.random() * randomPlaces.length)]
        board[Math.floor(indexOfFlaw / 3)][indexOfFlaw % 3] = '-';
        // console.log(board)
        flawHappend = true
        return board;
    }
    return board

}

function resetMatch() {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    // console.log(playerSymbol)
    if (playerSymbol === 'O') {
        board[1][1] = 'X';
    }
    updateBoard();
    canPlay = true;
    flawActivasion();
    updateTurnIndicators();

}

function swapSymbol(cell) {
    if (playerSymbol === 'X') {
        return cell === 'X' ? 'O' : (cell === 'O' ? 'X' : cell);
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
    document.querySelector('.choose-plyer-first').classList.remove('hide');
    document.querySelector('.turn-both').classList.add('before-play');
    updateTurnIndicators();
}
function changeContent() {
    var button = document.getElementById("game-mode");
    if (button.innerHTML === "صعب") {
    
      button.innerHTML = "مستحيل";
    } else {
    
      button.innerHTML = "صعب";
    }
  }
  
