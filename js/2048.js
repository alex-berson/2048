let interval;
let board = [];
const size = 4;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service worker registered!', reg);
            })
            .catch(err => {
                console.log('Service worker registration failed: ', err);
            });
    });
}

const initBoard = () => {

    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    newNumber(board);
    newNumber(board);    
}

const newNumber = (board) => {

    let i, j;

    let freeCells = [];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] == 0) freeCells.push([i, j]);
            }
        }

    [i, j] = freeCells[Math.trunc(Math.random() * freeCells.length)];
    
    let num = Math.random() <= 0.1 ? 4 : 2;

    board[i][j] = num;

    return [i, j, num];
}

const compressRow = (row) => {

    let compressedRow = [];
    
    for (let i = 0; i < row.length; i++) {

        let num = typeof row[i] == 'number' ? row[i] : row[i].value;

        if (num) compressedRow.push(row[i]);
    }

    return compressedRow;
}

const combineNumbers = (row) => {

    let score = 0;

    for (let i = 0; i < row.length - 1; i++) {
        
        if (typeof row[i] == 'number') {
            if (row[i] == row[i + 1]) {
                row[i] *= 2;
                row[i + 1] = 0;
                score += row[i];
            }
        } else {
            if (row[i].value == row[i + 1].value) {
                row[i].value *= 2;
                row[i].x2 = row[i + 1].x;
                row[i].y2 = row[i + 1].y;
                row[i + 1].value = 0;
                score += row[i].value;
            }
        }
    }

    return [row, score];
}

const slideNumbers = (row) => {

    let score;
    
    row = compressRow(row);
    [row, score] = combineNumbers(row);
    row = compressRow(row);

    while (row.length < size) row.push(0);

    return [row, score];
}

const flipBoard = (board) => {

    for (let i = 0; i < size; i++) {
        board[i].reverse();
    }
}

const transposeBoard = (board) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < i; j++) {
            [board[i][j], board[j][i]] = [board[j][i], board[i][j]];
        }
    }
}

const slideLeft = (board) => {

    let score = 0;

    for (let i = 0; i < size; i++) {

        let iScore;

        [board[i], iScore] = slideNumbers(board[i]);

        score += iScore;
    }

    return score;
}

const slideRight = (board) => {

    flipBoard(board);

    let score = slideLeft(board);

    flipBoard(board);

    return score;
}


const slideUp = (board) => {

    transposeBoard(board);

    let score = slideLeft(board);

    transposeBoard(board);

    return score;
}

const slideDown = (board) => {

    transposeBoard(board);

    let score = slideRight(board);

    transposeBoard(board);

    return score;
}

const markBoard = (board) => {

    let boardxy = [];

    for (let i = 0; i < size; i++) {

        let row = [];

        for (let j = 0; j < size; j++) {
            row.push({value: board[i][j], x: i, y: j})
        }

        boardxy.push(row);
    }

    return boardxy;
}

const unmarkBoard = (board, boardxy) => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            board[i][j] = boardxy[i][j] == 0 ? 0 : boardxy[i][j].value;
        }
    }
}

const boardChanged = (board1, board2) => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board1[i][j] != board2[i][j]) return true;
        }
    }

    return false;
}

const win = (board) => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == 2048) return true;
        }
    }

    return false;
}

const lost = (board) => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == 0) return false;
            if (i < 3 && board[i][j] == board[i + 1][j]) return false;
            if (j < 3 && board[i][j] == board[i][j + 1]) return false;
        }
    }

    return true;
}

const newGame = () => {

    clearBoard();
    initBoard();
    setTimeout(initPlacement, 1000);

    if (aiMode()) {
        setTimeout(aiPlay, 2000);
        return;
    }

    setTimeout(() => {
        touchScreen() ?  enableTouch() : enableKeys();
    }, 1250);
}

const move = (direction) => {

    let oldBoard = board.map(arr => arr.slice());
    let boardxy = markBoard(board);

    switch (direction) {
        case 'up': 
            slideUp(boardxy); 
            break;
        case 'right': 
            slideRight(boardxy); 
            break;
        case 'down': 
            slideDown(boardxy); 
            break;
        case 'left': 
            slideLeft(boardxy);
    }

    unmarkBoard(board, boardxy);

    if (win(board))  {
        slideTiles(boardxy);
        setTimeout(show2048, 200);
        return;
    }

    if (boardChanged(oldBoard, board)) {

        try {         
            slideTiles(boardxy);
        } catch(e) {
            resetTiles();
        }

        let [i, j, num] = newNumber(board);

        placeTile(i, j, num);

    } else {
        if (!touchScreen()) enableKeys();
    }

    if (lost(board)) setTimeout(lostFire, 400);
}

const aiPlay = () => {
    
    let timeLimit = 250;
    let startTime = new Date();
    let direction = mcs(board, startTime, timeLimit);
    let oldBoard = board.map(arr => arr.slice());
    let boardxy = markBoard(board);

    switch (direction) {
        case 'up': 
            slideUp(boardxy); 
            break;
        case 'right': 
            slideRight(boardxy); 
            break;
        case 'down': 
            slideDown(boardxy); 
            break;
        case 'left': 
            slideLeft(boardxy);
    }

    unmarkBoard(board, boardxy);

    if (win(board))  {
        slideTiles(boardxy);
        setTimeout(show2048, 200);
        return;
    }

    if (boardChanged(oldBoard, board)) {

        try {                
            slideTiles(boardxy);
        } catch(e) {}

        let [i, j, num] = newNumber(board);

        placeTile(i, j, num);
    }

    if (lost(board))  {
        setTimeout(() => {
            lostFire();
            if (!touchScreen()) enableKeys();
        }, 400);

        return;
    }

    if (!document.hidden) interval = setTimeout(aiPlay, 250);
}

const aiMode = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mode = urlParams.get('mode');
    
    return mode == 'ai';
}

const init = () => {

    window.addEventListener('visibilitychange', () => {
        if (!document.hidden && !win(board) && !lost(board) && aiMode()) {
            clearTimeout(interval);
            resetTiles();
            interval = setTimeout(aiPlay,  250)
        };
    }, false);


    initBoard();
    disableTapZoom();
    setBoardSize();
    showBoard();

    setTimeout(() => {
        initPlacement();
    }, 500);

    if (aiMode()) {
        setTimeout(aiPlay, 1300);
        return;
    }

    setTimeout(() => {
        touchScreen() ?  enableTouch() : enableKeys();
    }, 750);    
}

window.onload = () => document.fonts.ready.then(init());