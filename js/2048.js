const size = 4;
let board = [];
let score = 0;
let touchstartX, touchstartY;
let id = 0;

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
    //    [2, 4, 2, 8],
    //  [16, 2, 16, 4],
    //  [2, 4, 8, 4],
    //  [8, 64, 4, 0]
    // ];

    // console.log(isNaN(board[0][0]));

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

const slideTiles = (boardxy) => {

    const cells = document.querySelectorAll('.cell');

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
           
            if (boardxy[i][j] != 0 && (boardxy[i][j].x != i || boardxy[i][j].y != j)) {

                const cell = cells[i * size + j];

                const cell2 = cells[boardxy[i][j].x * size + boardxy[i][j].y];

                // console.log(cell2);


                // const rect = cell2.getBoundingClientRect();
                // const x = rect.left + rect.width / 2;
                // const y = rect.top + rect.height / 2;
                // const el = document.elementFromPoint(x, y);

                // tile = document.querySelector(`#${el.id}`);


                // console.log(document.elementsFromPoint(x, y));
                // console.log(el.id);


                const tile = document.querySelector(`#t${boardxy[i][j].x * size + boardxy[i][j].y}`);

                tile.style.top = `${cell.offsetTop}px`;
                tile.style.left = `${cell.offsetLeft}px`;
                // tile.id = `t${i * size + j}`;

                tile.i = i;
                tile.j = j;

                if (boardxy[i][j].x1 == undefined) {
                    tile.addEventListener('transitionend', e => {
                        e.currentTarget.id = `t${tile.i * size + tile.j}`;
                    }, {once: true}); 
                } else {
                    tile.addEventListener('transitionend', e => {
                        e.currentTarget.remove();
                    }, {once: true}); 
                }

                



                // tile.style.transform = `translate(${cell.offsetLeft - tile.offsetLeft}px, ${tile.offsetTop - cell.offsetTop}px)`;
            }

            if (boardxy[i][j].x1 != undefined && (boardxy[i][j].x1 != i || boardxy[i][j].y1 != j)) {

                const cell = cells[i * size + j];

                const cell3 = cells[boardxy[i][j].x1 * size + boardxy[i][j].y1];

                // const rect = cell3.getBoundingClientRect();
                // const x = rect.left + rect.width / 2;
                // const y = rect.top + rect.height / 2;
                // const el = document.elementFromPoint(x, y);
                // console.log(el.id);

                // tile = document.querySelector(`#${el.id}`);

                const tile1 = document.querySelector(`#t${boardxy[i][j].x * size + boardxy[i][j].y}`);


                const tile = document.querySelector(`#t${boardxy[i][j].x1 * size + boardxy[i][j].y1}`);


                tile.style.zIndex = 100;

                // let num = boardxy[i][j].value

                tile.style.top = `${cell.offsetTop}px`;
                tile.style.left = `${cell.offsetLeft}px`;

                tile.i = i;
                tile.j = j;

                tile.addEventListener('transitionend', e => {

                    tile1.remove();

                    const tile = e.currentTarget;

                    // console.log(tile.innerText);

                    // tile.innerText = parseInt(tile.innerText) * 2; 

                    tile.innerText = boardxy[tile.i][tile.j].value; 

    
                    // console.log(boardxy[tile.i][tile.j].value);
                    // console.log(parseInt(tile.j));



                    // console.log(boardxy[parseInt(tile.i)][parseInt(tile.j)]);



                    const power = Math.log2(parseInt(tile.innerText));
                    const backgroundLightness = 100 - power * 9;
                    const textLightness = backgroundLightness <= 50 ? 90 : 10;
                
                    tile.style.backgroundColor = `hsl(0, 50%, ${backgroundLightness}%)`;
                    tile.style.color = `hsl(0, 50%, ${textLightness}%)`;

                    tile.id = `t${tile.i * size + tile.j}`;



                    // tile.style.animation = 'pop 0.1s ease forwards';

                    // tile.addEventListener('animationend', e => {
                    //     tile.style.animation = '';
                    // }, {once: true}); 



                    // tile.style.opacity = 1;
                    // tile.classList.remove('appear');


                    // tile.style.transform += 'scale(2)';


                    // console.log(tile);

                    // const rect = tile.getBoundingClientRect();

                    // const x = rect.left + rect.width / 2;
                    // const y = rect.top + rect.height / 2;
                    // const el = document.elementsFromPoint(x, y)[1];

                    // el.remove();

                    // el.classList.remove('visible');

                    // el.style.opacity = 0;

                    // el.style.display = "none";

                    tile.classList.add('pop');

                    // tile.style.animation = `pop 0.2s ease 0.1s forwards`;


                    tile.style.zIndex = 'auto';

                    // enableKeys();
                    // enableTouch();


                }, {once: true}); 

                tile.addEventListener('animationend', e => {

                    let tile = e.currentTarget;
                    
                    tile.classList.remove('pop');
                }, {once: true});



                // setTimeout(() => {
                    // document.querySelector(`#t${i * size + j}`).classList.remove('appear');
                    // document.querySelector(`#t${i * size + j}`).removeAttribute('id');

                    // tile.id = `t${i * size + j}`;
                    // tile.innerText = parseInt(tile.innerText) * 2; 
                // }, 110);

                // tile.style.transform = `translate(${cell.offsetLeft - tile.offsetLeft}px, ${tile.offsetTop - cell.offsetTop}px)`;
            }
        }
    }
}

const checkBoard = () => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] != 0) {
                if (document.querySelector(`#t${i * size + j}`).innerText != board[i][j]) return true;
            }
        }
    }
    return false;
}


const move = (direction) => {

    // let changed;
    // let code = e.key;
    let oldBoard = board.map(arr => arr.slice());

    let boardxy = markBoard(board);

    // console.log(boardxy);

    // console.log(isNaN(board[0][0]));
    // console.log(isNaN(boardxy[0][0]));



    // if (checkBoard()) {
    //     alert("ERRER");
    //     return;
    // }
    // console.table(oldBoard);

    switch (direction) {
        // case 'ArrowDown': changed = slideDown(); break;
        // case 'ArrowUp': changed = slideUp(); break;
        // case 'ArrowLeft': changed = slideLeft();break;
        // case 'ArrowRight': changed = slideRight(); break;

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

    console.log(board.map(arr => arr.slice()));



    console.log(boardxy.map(arr => arr.slice()));

    if (won(board))  {
        setTimeout(() => console.log("Game Over"), 200);
        return;
    }

    if (changed(oldBoard, board)) {
        // console.log("changed")
        slideTiles(boardxy);

        let [i, j, num] = addNumber(board);

        placeNumber(i, j, num);

        // updateBoard(board);
        // console.table(board.map(arr => arr.slice()));


    } else {
        enableKeys();
        enableTouch();
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

    
    } while (iterations++ < 5000);

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

        console.time()

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
        console.timeEnd();


    }


    // updateBoard(board);
}

const enableMoves = () => document.addEventListener('keydown', move);

const updateBoard = (board) => {

    const board1d = board.flat();

    document.querySelectorAll('.cell').forEach((cell, i) => {
        cell.innerText = board1d[i] == 0 ? '' : board1d[i];
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

    let num = Math.random() <= 0.1 ? 4 : 2;

    board[i][j] = num;

    return[i, j, num];
}

const newTile = (i, j, num) => {

    const cell16 = document.querySelector('#c15');
    const tile = document.createElement('div'); 
    tile.classList.add('tile'); 
    tile.id = `t${i * size + j}`;

    // tile.id = `t${id++}`;            
    cell16.after(tile);

    tile.innerText = board[i][j];

    const power = Math.log2(num);
    const backgroundLightness = 100 - power * 9;
    const textLightness = backgroundLightness <= 50 ? 90 : 10;

    tile.style.backgroundColor = `hsl(0, 50%, ${backgroundLightness}%)`;
    tile.style.color = `hsl(0, 50%, ${textLightness}%)`;

    return tile;
}

const initPlacement = () => {

    const cells = document.querySelectorAll('.cell');
    // const cell16 = document.querySelector('#c15');
    // const tiles = document.querySelectorAll('.tile:not(.visible)');

    let n = 0;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            if (board[i][j] != 0) {

                // console.log(cell16);

                // const tile = document.createElement('div'); 
                // tile.classList.add('tile');  
                // tile.id = `t${id++}`;            
                // cell16.after(tile);

                const tile = newTile(i, j, board[i][j]);

                const cell = cells[i * size + j];
                // const tile = tiles[n++];
                const offsetTop = cell.offsetTop;
                const offsetLeft = cell.offsetLeft;

                tile.style.top = `${offsetTop}px`;
                tile.style.left = `${offsetLeft}px`;

                // tile.id = `t${id++}`;
                // tile.style.transform = "scale(0)";

                // setTimeout(() => {
                //     tile.style.opacity = 1;
                //     tile.style.transform = "scale(100%)";
                // }, 100);

                // tile.innerText = board[i][j];
                // const power = Math.log2(board[i][j]);
                // const backgroundLightness = 100 - power * 9;
                // const textLightness = backgroundLightness <= 50 ? 90 : 10;

                // tile.style.backgroundColor = `hsl(0, 50%, ${backgroundLightness}%)`;
                // tile.style.color = `hsl(0, 50%, ${textLightness}%)`;


                tile.style.display = "flex";

                tile.classList.add('appear');

                // tile.style.animation = 'appear 0.1s ease 0.1s forwards';

                tile.addEventListener('animationend', e => {

                    let tile = e.currentTarget;
                    
                    tile.style.opacity = 1;
                    tile.classList.remove('appear');
                }, {once: true});

            }
        }
    }
}

const placeNumber = (i , j, num) => {

    const cell = document.querySelectorAll('.cell')[i * size + j];
    // const tile = document.querySelector('.tile:not(.visible)');
    // const cell16 = document.querySelector('#c15');

    // const tile = document.createElement('div'); 
    // tile.classList.add('tile');  
    // tile.id = `t${id++}`;            
    // cell16.after(tile);

    const tile = newTile(i, j, num);

    const offsetTop = cell.offsetTop;
    const offsetLeft = cell.offsetLeft;

    tile.style.top = `${offsetTop}px`;
    tile.style.left = `${offsetLeft}px`;
    // tile.innerText = num;
    // tile.id = `t${i * size + j}`;

    // const power = Math.log2(board[i][j]);
    // const backgroundLightness = 100 - power * 9;
    // const textLightness = backgroundLightness <= 50 ? 90 : 10;

    // tile.style.backgroundColor = `hsl(0, 50%, ${backgroundLightness}%)`;
    // tile.style.color = `hsl(0, 50%, ${textLightness}%)`;

    // tile.style.backgroundColor = `blue`;


    // tile.style.setProperty("--background-lightness", `${backgroundLightness}%`);
    // tile.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`);

    tile.style.display = "flex";

    // tile.classList.add('appear');

    tile.classList.add('appear');

    // tile.style.animation = 'appear 0.1s ease 0.1s forwards';


    tile.addEventListener('animationend', e => {

        tile.style.opacity = 1;
        tile.classList.remove('appear');

        enableKeys();
        enableTouch();
    }, {once: true});
}

const disapear = () => {

    const tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        tile.classList.remove('appear');
    });
}

const numTiles = () => {

    let tiles = 0;

    for (let i = 0; i < size; i++) {
       for (let j = 0; j < size; j++) {
         if (board[i][j] != 0) tiles++;
       }
     }

   return tiles;
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

const compress = row => {

    let compressedRow = []
    
    for (let i = 0; i < row.length; i++) {

        let num = typeof row[i] == 'number' ? row[i] : row[i].value;

        if (num) compressedRow.push(row[i]);

        // if (isNaN(row[i])) {
        //     if (row[i].value != 0) compressedRow.push(row[i]);
        // } else {
            // if (row[i] != 0) compressedRow.push(row[i]);
        // }
    }

    // return row.filter(Boolean);


    return compressedRow;

}

const combine = row => {

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
                row[i].x1 = row[i + 1].x;
                row[i].y1 = row[i + 1].y;
                row[i + 1].value = 0;
                score += row[i].value;
            }
        }
    }

    return [row, score];
}

// const compress = row => {

//     let compressedRow = []
    
//     for (let i = 0; i < row.length; i++) {
//         if (row[i] != 0) compressedRow.push(row[i]);
//     }

//     return compressedRow;


//     // row.filter(Boolean);
// }

// const combine = row => {

//     let score = 0;

//     for (let i = 0; i < row.length - 1; i++) {
//         if (row[i] == row[i + 1]) {
//             row[i] *= 2;
//             // if (vector[i] == 2048) win();
//             row[i + 1] = 0;
//             score += row[i];
//         }
//     }

//     return [row, score];
// }

const slide = row => {

    let score;
    
    row = compress(row);

    [row, score] = combine(row);

    row = compress(row);

    while (row.length < size) row.push(0);

    return [row, score];
}

const flip = (board) => {
    // for (let y = 0; y < size; y++) {
    //     for (let xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
    //       [board[y][xLeft], board[y][xRight]] = [board[y][xRight], board[y][xLeft]];
    //     }
    // }

    for (let i = 0; i < size; i++) {
        // console.log(board);
        // console.log(board[i]);
        board[i].reverse();
    }

    // board.map(row => row.reverse());


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

    const key = e.key;

    switch (key) {
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
            break;
        default: 
            enableKeys();

    }
}, {once: true});

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
    }, {once: true});
}

const init = () => {

    initBoard();
    disableTapZoom();
    setBoardSize();
    // updateBoard(board);
    showBoard();

    setTimeout(initPlacement, 800);

    // // setTimeout(disapear, 2800);


    enableKeys();
    enableTouch();

    // setTimeout(() => {
        // auto(board);
    // }, 2000); 
    
}

window.onload = () => document.fonts.ready.then(init()); 

// init();