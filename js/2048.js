// let aiMode = false; //

let moves = []; //
let adds = []; //

let interval; //

let board = [];
const size = 4;

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('service-worker.js')
//             .then(reg => {
//                 console.log('Service worker registered!', reg);
//             })
//             .catch(err => {
//                 console.log('Service worker registration failed: ', err);
//             });
//     });
// }

// const shuffle = (array) => {

//     for (let i = array.length - 1; i > 0; i--) {

//         const j = Math.floor(Math.random() * (i + 1));

//         [array[i], array[j]] = [array[j], array[i]]; 
//     }

//     return array;
// }

const initBoard = () => {

    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    // board = [
    //     [0,0,0,0],
    //     [0,4,0,0],
    //     [0,0,2,0],
    //     [0,0,0,0]
    // ];

    // board = [
    //     [16,8,4,2],
    //     [0,0,0,0],
    //     [0,0,0,0],
    //     [0,0,0,0]
    // ];

    // let n1 = null;
    // let n2 = null;
    // let n2 = [3,0,2];      

    let n1 = newNumber(board, 1);
    let n2 = newNumber(board, 2);    

    // board = [
    //     [2048, 1024, 512, 256],
    //   [128, 64, 32, 16],
    //   [8, 4, 2, 0],
    //   [0, 0, 0, 0]
    //  ];

    // board = [
    //     [2048, 1024, 512, 256],
    //   [16, 32, 64, 128],
    //   [8, 4, 2, 0],
    //   [0, 0, 0, 0]
    //  ];

    // board = [
    //     [2048, 1024, 512, 256],
    //   [2, 0, 0, 128],
    //   [2, 0, 0, 64],
    //   [4, 8, 16, 32]
    //  ];

    // board = [
    //     [8,4,2,2],
    //     [4,1024,32,16],
    //     [256,128,64,4],
    //     [2,512,4,2]
    // ];

    // board = [
    //     [4,4,256,4],
    //     [2,1024,128,512],
    //     [8,4,32,64],
    //     [2,2,16,2]
    // ];

    // board = [
    //     [2,4,1024,2],
    //     [128,8,64,2],
    //     [4,16,256,2],
    //     [2,32,512,4]
    // ]; 

    // board = [
    //     [1024,512,256,128],
    //     [16,32,64,0],
    //     [4,8,0,0],
    //     [2,0,0,0]
    // ];

    //  board = [
    //     [1024,512,256,128],
    //     [64,32,16,0],
    //     [8,4,0,0],
    //     [2,0,0,0]
    // ];

    return [n1, n2]
}

const initBoard2 = () => {

    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];



    // let n1 = null;
    // let n2 = null;

    let n1 = [1,1,4];      
    let n2 = [2,2,2];  
    
    board[1][1] = 4;
    board[2][2] = 2;

    // let n1 = newNumber(board, 1);
    // let n2 = newNumber(board, 2);    

    return [n1, n2]
}

const boardChanged = (board1, board2) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board1[i][j] != board2[i][j]) return true;
        }
    }
    return false;
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

const newGame = () => {

    clearBoard();
    initBoard();
    // setTimeout(initPlacement, 1200);
    setTimeout(initPlacement, 1000);


    if (aiMode()) {
        // console.time(); //
        setTimeout(aiPlay, 2000);
        return;
    }

    setTimeout(() => {
        // swiped = false;
        enableKeys();
        enableTouch();
    }, 1250);
}

// const restartWin = () => {

//     // const tile = e.currentTarget;

//     // aiMode = true; //

//     // tile = tile.currentTarget ? tile.currentTarget : tile;
//     // tile = e.currentTarget;

//     // tile.style.opacity = 0;
//     // document.querySelector('.board').removeAttribute('style');

//     // tile.addEventListener('transitionend', e => {

//     //     const tile = e.currentTarget;       

//     //     tile.remove();
//     // });

//     clearBoard();
//     initBoard();
//     setTimeout(initPlacement, 1200);

//     if (aiMode()) {
//         // console.time(); //
//         setTimeout(aiPlay, 2000);
//         return;
//     }

//     setTimeout(() => {
//         enableKeys();
//         enableTouch();
//     }, 1200);
// }

// const restartLost = () => {

//     // aiMode = true; //

//     clearBoard();

//     // document.querySelectorAll('.tile').forEach(tile => {        
//     //     tile.style.transition = "opacity 1s";
//     // });

//     // document.querySelectorAll('.tile').forEach(tile => {

//     //     tile.style.opacity = 0;

//     //     tile.addEventListener('transitionend', e => {  
//     //         e.currentTarget.remove();
//     //     }, {once: true});
//     // });

//     if (aiMode()) {
//         // console.time(); //
//         initBoard();
//         setTimeout(initPlacement, 1200);
//         setTimeout(aiPlay, 2000);
//         return;
//     }

//     setTimeout(() => {
//         swiped = false;
//         initBoard();
//         initPlacement();
//         enableKeys();
//         enableTouch();
//     }, 1200);

// }

const move = (direction) => {

    console.log('MOVE');

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
        // setTimeout(show2048, 400);
        return;
    }

    if (boardChanged(oldBoard, board)) {

        moves.push(direction);  //
        try {         
            // stopAnimation();       
            slideTiles(boardxy);
        } catch(e) {
            // alert(e); //
            console.log(e);
            resetTiles();
        }

        // slideTiles(boardxy);

        let [i, j, num] = newNumber(board);

        adds.push([i, j, num]);

        placeTile(i, j, num);

    } else {
        if (!touchScreen()) enableKeys();
        // setTimeout(() => {
            // touchScreen() ? enableTouch() : enableKeys(); //
            // console.log("NOT CHANGED", swiped);
        // }, 0);
    }

    if (lost(board)) setTimeout(lostFire, 400);
}

const aiPlay = () => {
    
    let timeLimit = 250;
    let startTime = new Date();

    let direction = mcs(board, startTime, timeLimit);
    // do {} while (new Date() - startTime < timeLimit);
    // let direction = directionsf.shift(); //

    // if (almost(board)) alert("ALMOST!"); //
    moves.push(direction); //

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

        // setTimeout(show2048, 400);

        return;
    }

    if (boardChanged(oldBoard, board)) {

        try {                
            slideTiles(boardxy);
        } catch(e) {}

        let [i, j, num] = newNumber(board);

        adds.push([i, j, num]);

        placeTile(i, j, num);
    }

    if (lost(board))  {
        setTimeout(() => {
            lostFire();
            // enableTouch();
            enableKeys();
        }, 400);
        return;
    }

    if (!document.hidden) interval = setTimeout(aiPlay, 250);
}

const auto = () => {

    let dirs = []; //
    let adds = []; //
    let iterations = 0
    let numLost = 0;
    let found = false; //
    let fileNum = 50;

    const scores = (board) => {

        let score = 0;
        let empty = 0;
    
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                score += board[i][j];
                if (board[i][j] == 2048) score += 10000;
    
    
                // if (board[i][j] > score) score = board[i][j];
            }
        }
    
        return empty == 0 ? score : score / empty;
    
    }

    outer: while (true) {

        dirs = []; //
        adds = []; //

        console.time()

        let slides = 0;
        [n1, n2] = initBoard();

        found = false; //

        adds.push(n1, n2); //

        iterations++;

        do {

            let startTime = new Date();

            let direction = mcs(board, startTime, 250);

            dirs.push(direction);  //

            let oldBoard = board.map(arr => arr.slice());

            switch (direction) {
                case 'up': 
                    slideUp(board); 
                    break;
                case 'right': 
                    slideRight(board); 
                    break;
                case 'down': 
                    slideDown(board); 
                    break;
                case 'left': 
                    slideLeft(board);
            }

            if (boardChanged(oldBoard, board)) {

                if (win(board)) break;

                if (screenShot32(board)) {
                    found = true;
                    console.table(board);

                    if (found && order(board)) {

                        fileNum++;
            
                        console.log(fileNum);
            
                        fs = require('fs');
            
                        fs.writeFileSync(`dirs${fileNum}.js`,  "directionsf = " + JSON.stringify(dirs));
            
                        fs.writeFileSync(`adds${fileNum}.js`,  "numbers = " + JSON.stringify(adds));
            
                        continue outer;
                        // return;
                    }
                }

                adds.push(newNumber(board)); //

                // newNumber(board);
            } else {
                // console.log('NOT CHANGED');
                continue outer;
            }

            slides++;

            // if (slides < 900) continue;

            if (screenShot32(board)) {
                found = true;
                console.table(board);

                if (found && order(board)) {

                    fileNum++;
        
                    console.log(fileNum);
        
                    fs = require('fs');
        
                    fs.writeFileSync(`dirs${fileNum}.js`,  "directionsf = " + JSON.stringify(dirs));
        
                    fs.writeFileSync(`adds${fileNum}.js`,  "numbers = " + JSON.stringify(adds));

                    continue outer;
        
                    // return;
                }
            }

            if (find64(board) || direction == undefined) {
                // console.log("OUTER");

                continue outer;
            }

        } while (!lost(board));

        console.log(iterations, slides, scores(board));

        if (scores(board) < 10000) {
            numLost++;
            console.log(numLost);
            console.table(board);
        }

        console.timeEnd();

        if (found) {

            fileNum++;

            console.log(fileNum);

            fs = require('fs');

            fs.writeFileSync(`dirs${fileNum}.js`,  "directionsf = " + JSON.stringify(dirs));

            fs.writeFileSync(`adds${fileNum}.js`,  "numbers = " + JSON.stringify(adds));

            // return;
        }
    }

}

// const mcsNext = (board, num, freeCells) => {

//     let startTime = new Date();
//     let timeLimit = 80;

//     let iterations = 0;

//     let directions = ['up','right','down','left'];

//     let tries = new Array(freeCells.length).fill(0);
//     let scores = new Array(freeCells.length).fill(0);

//     do {

//         // let i = 0;
//         let firstMove;
//         let score = 0;

//         let newBoard = board.map(arr => arr.slice());

//         let n = Math.floor(Math.random() * freeCells.length);

//         let [i, j] = freeCells[n];

//         // let newBoard = board;
//         newBoard[i][j] = num;

//         do {
//             let direction = directions[Math.floor(Math.random() * size)];
//             let oldBoard = newBoard.map(arr => arr.slice());

//             switch (direction) {
//                 case 'up': 
//                     score += slideUp(newBoard); 
//                     break;
//                 case 'right': 
//                     score += slideRight(newBoard); 
//                     break;
//                 case 'down': 
//                     score += slideDown(newBoard); 
//                     break;
//                 case 'left': 
//                     score += slideLeft(newBoard);
//             }

//             if (boardChanged(oldBoard, newBoard)) {

//                 // i++;

//                 // if (firstMove == undefined) firstMove = direction;

//                 if (win(newBoard))  {
//                     // console.log("Game Over", i);
//                     // updateBoard(newBoard);    
//                     break;
//                 }

//                 newNumber(newBoard, true);

//                 // if (lost(board))  {

//                 //     // j++;
                    
//                 //     console.log("Game Over", i, scores(board));
//                 //     // initBoard();  
//                 //     // i = 0;  
//                 //     // continue;
//                 //     updateBoard();    
        
//                 //     return;
//                 // }
//             }

//         } while (!lost(newBoard));

    
//         // console.log("Game Over", i, scores(newBoard), first);

//         // updateBoard(newBoard); 

//         tries[n]++;
//         // moves[first][1] += scores(newBoard);
//         scores[n] += score;

//         iterations++;
        
//         // } while (iterations < 1000);

//     } while (!timeOver(startTime, timeLimit));

//     // document.querySelector('h1').innerText = iterations;

//     // console.log('iterations: ', iterations);

//     // console.table(tries);
//     // console.table(scores);


//     let bestMove;
//     let bestScore = -Infinity;

//     for (let i = 0; i < freeCells.length; i++) {

//         if (tries[i] == 0) continue;

//         // console.log(move, i);

//         if (scores[i] / tries[i] > bestScore) [bestMove, bestScore] = [i, scores[i] / tries[i]];
//     }

//     // console.log(bestMove);

//     // if (bestMove == undefined) console.table(moves);

//     return freeCells[bestMove];
// }


const newNumber = (board , init = 3) => {

    let i, j;

    let freeCells = [];

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] == 0) freeCells.push([i, j]);
            }
        }

    [i, j] = freeCells[Math.floor(Math.random() * freeCells.length)];
    
    let num = Math.random() <= 0.1 ? 4 : 2;

    // if (init == 1) [i, j] = [1,1];
    // if (init == 2) [i, j] = [2,2];

    // num = 512;
    // [i, j, num] = numbers.shift();

    board[i][j] = num;

    return [i, j, num];
}

const compressRow = (row) => {

    let compressedRow = []
    
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

        let scoreI;

        [board[i], scoreI] = slideNumbers(board[i]);

        score += scoreI;
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

const win = (board) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == 2048) return true;
        }
    }
    return false;
}

const find64 = (board) => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == 64) return true;
        }
    }

    return false;
}

const order = (board) => {

    for (let i = 0; i < size; i++) {
        if (board[0][i] != Math.pow(2, 5 - i)) return false;
    }
    
    return true;
}

const inRow = (board) => {

    let uniques = [0,0,0,0,0,0,0,0,0,0]

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] != 0) uniques[Math.log2(board[i][j]) - 1]++; 
        }
    }

    if (uniques[0] != 0) return false;

    for (let i = 1; i <= 4; i++) {
        if (uniques[i] != 1) return false;
    }

    for (let i = 0; i <= 3; i++) {
        if (board[0][i] != Math.pow(2, 5 - i)) return false;
    }

    return true;
}

const screenShot32 = (board) => {

    let uniques = [0,0,0,0,0,0,0,0,0,0]

    // outer: for (let n = 1; n <= 10; n++) {
    //     for (let i = 0; i < size; i++) {
    //         for (let j = 0; j < size; j++) {
    //             if (board[i][j] == Math.pow(2, n)) continue outer;
    //         }
    //     }

    //     return false;
    // }

    // for (let i = 0; i < size; i++) {
    //     for (let j = 0; j < size; j++) {
    //         if (board[i][j] == 0) return false;
    //     }
    // }

    // return true;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] != 0) uniques[Math.log2(board[i][j]) - 1]++; 
        }
    }

    // if (uniques[0] != 0) return false;

    for (let i = 0; i <= 3; i++) {
        if (uniques[i] != 1) return false;
    }

    return true;
}

const screenShot = (board) => {

    let uniques = [0,0,0,0,0,0,0,0,0,0]

    // outer: for (let n = 1; n <= 10; n++) {
    //     for (let i = 0; i < size; i++) {
    //         for (let j = 0; j < size; j++) {
    //             if (board[i][j] == Math.pow(2, n)) continue outer;
    //         }
    //     }

    //     return false;
    // }

    // for (let i = 0; i < size; i++) {
    //     for (let j = 0; j < size; j++) {
    //         if (board[i][j] == 0) return false;
    //     }
    // }

    // return true;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] != 0) uniques[Math.log2(board[i][j]) - 1]++; 
        }
    }

    for (let i = 1; i <= 9; i++) {
        if (uniques[i] != 1) return false;
    }

    return true;
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

const aiMode = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mode = urlParams.get('mode');
    
    if (mode == 'ai') return true;

    // return true;

    return false;


    // return aiMode; //
}

const init = () => {

    window.addEventListener('visibilitychange', () => {

        // console.log('visibilitychange', document.hidden);

        if (!document.hidden && !win(board) && !lost(board) && aiMode()) {
            // console.table(board);
            clearTimeout(interval);
            resetTiles();
            interval = setTimeout(aiPlay,  250)
        };
    }, false);


    let [n1, n2] = initBoard();

    adds.push(n1, n2); //

    disableTapZoom();
    setBoardSize();

    // resetTiles();

    showBoard();

    setTimeout(() => {
        initPlacement();
    }, 500);

    if (aiMode()) {
        console.time();
        setTimeout(aiPlay, 1300);
        return;
    }

    setTimeout(() => {
        enableKeys();
        enableTouch();
    }, 750);



    // setTimeout(() => {
    //     auto(board);
    // }, 300); 
    
}

window.onload = () => document.fonts.ready.then(init()); 

// init();


// const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

const mcs = (board, startTime, timeLimit) => {

    let iterations = 0; //
    let directions = ['up','right','down','left'];
    let tries = {up:0, right:0, down:0, left:0};
    let scores = {up:0, right:0, down:0, left:0};

    do {

        let score = 0;
        let firstMove;
        let newBoard = board.map(arr => arr.slice());

        do {
            let direction = directions[Math.floor(Math.random() * size)];
            let oldBoard = newBoard.map(arr => arr.slice());

            switch (direction) {
                case 'up': 
                    score += slideUp(newBoard); 
                    break;
                case 'right': 
                    score += slideRight(newBoard); 
                    break;
                case 'down': 
                    score += slideDown(newBoard); 
                    break;
                case 'left': 
                    score += slideLeft(newBoard);
            }

            if (boardChanged(oldBoard, newBoard)) {

                if (firstMove == undefined) firstMove = direction;
                if (win(newBoard)) break;

                newNumber(newBoard);
            }

        } while (!lost(newBoard));

        tries[firstMove]++;
        scores[firstMove] += score;

        iterations++; //
    
    } while (new Date() - startTime < timeLimit);

    let bestDirection;
    let bestScore = -Infinity;

    for (let dir of directions) {
        if (tries[dir] == 0) continue;
        if (scores[dir] / tries[dir] > bestScore) [bestDirection, bestScore] = [dir, scores[dir] / tries[dir]];
    }

    return bestDirection;
}

const mcs2 = (board, startTime, timeLimit) => {

    let iterations = 0; //
    // let directions = ['up','right','down','left'];
    // let tries = {up:0, right:0, down:0, left:0};
    // let scores = {up:0, right:0, down:0, left:0};
    let directions = ['up','left'];
    let tries = {up:0, left:0};
    let scores = {up:0, left:0};

    do {

        let score = 0;
        let score2 = 0
        let firstMove;
        let newBoard = board.map(arr => arr.slice());

        let dirs = [];
        let adds = [[1, 1, board[1][1]], [2, 2, board[2][2]]];

        // let directions = ['up','left'];

        let stuck;

        do {

            // shuffle(directions);
            let direction = directions[Math.floor(Math.random() * directions.length)];

            if (stuck != undefined) direction = stuck == 'up' ? 'left' : 'up';
            // let direction = directions.shift();
            let oldBoard = newBoard.map(arr => arr.slice());

            switch (direction) {
                case 'up': 
                    score += slideUp(newBoard); 
                    break;
                case 'right': 
                    score += slideRight(newBoard); 
                    break;
                case 'down': 
                    score += slideDown(newBoard); 
                    break;
                case 'left': 
                    score += slideLeft(newBoard);
            }


            if (boardChanged(oldBoard, newBoard)) {

                if (firstMove == undefined) firstMove = direction;
                if (win(newBoard)) break;

                dirs.push(direction);

                if (inRow(newBoard) && dirs.length < 25) {
                    score2 = 1;
    
                    console.table(board);
    
                    console.table(newBoard);

                    console.log(dirs);

                    console.log(adds);

                    console.log(dirs.length);

    
    
                    throw 'END';

                }

                adds.push(newNumber(newBoard));



            } else {
                if (stuck != undefined) break;
                stuck = direction;
            }

            if (inRow(newBoard) && dirs.length < 25) {
                score2 = 1;

                console.table(board);

                console.table(newBoard);

                console.log(dirs);

                console.log(adds);
 
                console.log(dirs.length);


                throw 'END';

                // return undefined

                // break;
            }

        } while (!lost(newBoard) && !find64(newBoard));

        tries[firstMove]++;
        scores[firstMove] += score2;

        iterations++; //

    
    } while (new Date() - startTime < timeLimit);

    let bestDirection;
    let bestScore = -Infinity;

    for (let direction of directions) {
        if (tries[direction] == 0) continue;
        if (scores[direction] / tries[direction] > bestScore) [bestDirection, bestScore] = [direction, scores[direction] / tries[direction]];
    }

    if (bestDirection == undefined) bestDirection = 'right';

    if (bestScore == 0) bestDirection = undefined;


    console.log(tries, scores);

    return bestDirection;
}