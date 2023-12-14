function checkWin(player, board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
    return false;
}

function emptyNodes(board) {
    let states = [];
    for (let i = 0; i < 9; i++) {
        if (board[Math.floor(i / 3)][i % 3] === '') states.push(i);
    }
    return states;
}

function maxi(board, depth) {
    depth -= 1;
    let empty = emptyNodes(board);
    if (checkWin("X", board)) return 1 + depth;
    if (checkWin("O", board)) return -1;
    if (empty.length === 0) return 0;
    let costs = empty.map(i => {
        board[Math.floor(i / 3)][i % 3] = "X";
        let cost = mini(board, depth);
        board[Math.floor(i / 3)][i % 3] = '';
        return cost;
    });
    return Math.max(...costs);
}

function mini(board, depth) {
    depth -= 1;
    let empty = emptyNodes(board);
    if (checkWin("X", board)) return 1 + depth;
    if (checkWin("O", board)) return -1;
    if (empty.length === 0) return 0;
    let costs = empty.map(i => {
        board[Math.floor(i / 3)][i % 3] = "O";
        let cost = maxi(board, depth);
        board[Math.floor(i / 3)][i % 3] = '';
        return cost;
    });
    return Math.min(...costs);
}

function minimax(board) {
    let depth = 8;
    let empty = emptyNodes(board);
    if (empty.length == 0){
        return -1;
    }
    let costs = empty.map(i => {
        board[Math.floor(i / 3)][i % 3] = "X";
        let cost = mini(board, depth);
        board[Math.floor(i / 3)][i % 3] = '';
        return cost;
    });
    let maxCost = Math.max(...costs);
    let bestMoves = empty.filter((_, index) => costs[index] === maxCost);
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function aiMove(board) {
    const newMove = minimax(board);
    if (newMove == -1) {
        return { board, gameStatus: 'Tie' };
    }
    board[Math.floor(newMove / 3)][newMove % 3] = "X";
    return { board, gameStatus: checkWin("X", board) ? 'X' : checkWin("O", board) ? 'O' : 'On going' };
}
