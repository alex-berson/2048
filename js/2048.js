const size = 4;
let board = [];
let score = 0;
let touchstartX, touchstartY;

const showBoard = () => document.querySelector('body').style.opacity = 1;

const setBoardSize = () => {

    let boardSize;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / size) * size;
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / size) * size;
    }

    // console.log(boardSize);

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    // document.documentElement.style.setProperty('--tile-size', boardSize / size - 1 + 'px');
}

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const initBoard = () => {

    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];


    // board = [
        [4, 128, 2, 4],
    //  [2, 16, 4, 8],
    //  [16, 64, 16, 2],
    //  [4, 4, 4, 2]
    //];

    addNumber(board);
    addNumber(board);
}

const changed = (board1, board2) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board1[i][j] != board2[i][j]) return true;
        }
    }
    return false;
}

const move = (direction) => {

    // let changed;
    // let code = e.key;
    let oldBoard = board.map(arr => arr.slice());
    // console.table(oldBoard);

    switch (direction) {
        // case 'ArrowDown': changed = slideDown(); break;
        // case 'ArrowUp': changed = slideUp(); break;
        // case 'ArrowLeft': changed = slideLeft();break;
        // case 'ArrowRight': changed = slideRight(); break;

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

    if (won(board))  {
        setTimeout(() => console.log("Game Over"), 200);
        return;
    }

    if (changed(oldBoard, board)) {
        addNumber(board);
        updateBoard(board);
        // console.table(board.map(arr => arr.slice()));

    }

    if (terminal(board))  setTimeout(() => console.log("Game Over"), 200);
}

const mcs = (board) => {

    let iterations = 0;

    let moves = [[0,0],[0,0],[0,0],[0,0]];

    do {

        let i = 0;
        let first = null;
        let score = 0;

        // let newBoard = board;

        let newBoard = board.map(arr => arr.slice());

        do {
            let direction = Math.floor(Math.random() * size);
            let oldBoard = newBoard.map(arr => arr.slice());

            switch (direction) {
                case 0: 
                    score += slideUp(newBoard); 
                    break;
                case 1: 
                    score += slideRight(newBoard); 
                    break;
                case 2: 
                    score += slideDown(newBoard); 
                    break;
                case 3: 
                    score += slideLeft(newBoard);
            }

            if (changed(oldBoard, newBoard)) {

                i++;

                if (first == null) first = direction;

                if (won(newBoard))  {
                    // console.log("Game Over", i);
                    // updateBoard(newBoard);    
                    break;
                }

                addNumber(newBoard);

                // if (terminal(board))  {

                //     // j++;
                    
                //     console.log("Game Over", i, scores(board));
                //     // initBoard();  
                //     // i = 0;  
                //     // continue;
                //     updateBoard();    
        
                //     return;
                // }
            }

        } while (!terminal(newBoard));

    
    // console.log("Game Over", i, scores(newBoard), first);

    // updateBoard(newBoard); 

    moves[first][0]++;
    // moves[first][1] += scores(newBoard);
    moves[first][1] += score;

    
    } while (iterations++ < 10000);

    // console.table(moves);

    let bestMove;
    let bestScore = -Infinity;

    for (let [i, move] of moves.entries()) {
        if (move[0] == 0) continue;

        // console.log(move, i);

        if (move[1] / move[0] > bestScore) [bestMove, bestScore] = [i, move[1] / move[0]];
    }

    // console.log(bestMove);

    // if (bestMove == undefined) console.table(moves);

    return bestMove;
}

const auto = () => {

    let iterations = 0
    let lost = 0;

    while (true) {

        // console.time()

        let slides = 0;
        initBoard();
        iterations++;

        do {

            let direction = mcs(board);

            // if (direction == undefined) {
                
            //     console.log(i, scores(board));

            //     console.table(board);
            //     return;
            // }

            // console.log(direction);
            let oldBoard = board.map(arr => arr.slice());

            switch (direction) {
                case 0: 
                    slideUp(board); 
                    break;
                case 1: 
                    slideRight(board); 
                    break;
                case 2: 
                    slideDown(board); 
                    break;
                case 3: 
                    slideLeft(board);
            }

            if (changed(oldBoard, board)) {

                if (won(board))  {
                    // console.log("Game Over", i);
                    // updateBoard(board);    
                    break;
                }

                addNumber(board);

                // updateBoard(board);

                // if (terminal(board))  {

                //     // j++;
                    
                //     console.log("Game Over", i, scores(board));
                //     // initBoard();  
                //     // i = 0;  
                //     // continue;
                //     updateBoard();    
        
                //     return;
                // }
            }

            slides++;

        } while (!terminal(board));


        console.log(iterations, slides, scores(board));

        if (scores(board) < 10000) {
            lost++;
            console.log(lost);
            console.table(board);
        }
        // console.timeEnd();


    }


    // updateBoard(board);
}

const enableMoves = () => document.addEventListener('keydown', move);

const updateBoard = (board) => {

    const board1d = board.flat();

    document.querySelectorAll('.tile').forEach((tile, i) => {
        tile.innerText = board1d[i] == 0 ? '' : board1d[i];
    });
}

const addNumber = (board) => {

    // let i, j;
    let freeCells = [];

    // console.log(board);

    // do {
    //     i = Math.floor(Math.random() * size);
    //     j = Math.floor(Math.random() * size);
    // } while (board[i][j]);
 
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == 0) freeCells.push([i, j]);
        }
    }

    // console.log(freeCells);

    // freeCells

    let [i, j] = freeCells[Math.floor(Math.random() * freeCells.length)];

    board[i][j] = Math.random() <= 0.1 ? 4 : 2;
}

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

const compress = vector => vector.filter(Boolean);

const combine = (vector) => {

    let score = 0;

    for (let i = 0; i < vector.length - 1; i++) {
        if (vector[i] == vector[i + 1]) {
            vector[i] *= 2;
            // if (vector[i] == 2048) win();
            vector[i + 1] = 0;
            score += vector[i];
        }
    }

    return [vector, score];
}

const slide = (vector) => {

    let score;
    
    vector = compress(vector);

    // if (array.length > 0) {
    //   for (let i = 0; i < array.length - 1; i++) {
    //     if (array[i] == array[i + 1]) {
    //       array[i] *= 2;
    //       array[i + 1] = 0;
    //     }
    //   }  
    // } 

    [vector, score] = combine(vector);

    vector = compress(vector);

    while (vector.length < size) vector.push(0);

    return [vector, score];
}

const flip = (board) => {
    // for (let y = 0; y < size; y++) {
    //     for (let xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
    //       [board[y][xLeft], board[y][xRight]] = [board[y][xRight], board[y][xLeft]];
    //     }
    // }

    for (let i = 0; i < size; i++) {
        board[i].reverse();
    }


}

const transpose = (board) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < i; j++) {
            [board[i][j], board[j][i]] = [board[j][i], board[i][j]];
        }
    }
}

const slideLeft = (board) => {

    // let changed = false;

    let score = 0;

    for (let i = 0; i < size; i++) {

        // let oldBoard = board.slice();

        let scoreI;

        [board[i], scoreI] = slide(board[i]);

        score += scoreI;


        // changed = changed || (board[i].join(',') != oldBoard[i].join(','));
    }

    // return changed;
    return score;
}

const slideRight = (board) => {
    flip(board);
    // let changed = slideLeft();
    let score = slideLeft(board);

    flip(board);
    // return changed;
    return score;
}


const slideUp = (board) => {
    transpose(board);
    // let changed = slideLeft();
    let score = slideLeft(board);

    transpose(board);
    // return changed;
    return score;
}

const slideDown = (board) => {
    transpose(board);
    // let changed = slideRight();
    let score = slideRight(board);

    transpose(board);
    // return changed;
    return score;
}

const won = (board) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j] == 2048) return true;
        }
      }
      return false;
}

const terminal = (board) => {

    // for (let x = 0; x < size; x++) {
    //   for (let y = 0; y < size; y++) {
    //     if (board[x][y] == 0) return false;
    //   }
    // }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] == 0) return false;
        if (i < 3 && board[i][j] == board[i + 1][j]) return false;
        if (j < 3 && board[i][j] == board[i][j + 1]) return false;
      }
    }

    return true;
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const enableKeys = () => document.addEventListener('keydown', e => {

    const code = e.key

    switch (code) {
        case 'ArrowUp': 
            move('up'); 
            break;
        case 'ArrowRight': 
            move('right'); 
            break;
        case 'ArrowDown': 
            move('down');
            break;
        case 'ArrowLeft': 
            move('left');
    }
});

const enableTouch = () => {

    document.querySelector('.board').addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    });

    document.querySelector('.board').addEventListener('touchend', e => {

        const touchendX = e.changedTouches[0].screenX;
        const touchendY = e.changedTouches[0].screenY;
        const dx = touchendX - touchstartX;
        const dy = touchendY - touchstartY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
    
        if (Math.max(absDx, absDy) > 10) {

            let direction = absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');

            move(direction);
        }    
    });
}

const init = () => {

    initBoard();
    disableTapZoom();
    setBoardSize();
    updateBoard(board);
    showBoard();
    enableKeys();
    enableTouch();

    // setTimeout(() => {
        // auto(board);
    // }, 2000); 
    
}

window.onload = () => document.fonts.ready.then(init()); 

// init();