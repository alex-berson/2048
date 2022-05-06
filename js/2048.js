const size = 4;
let board = [];
let score= 0;

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

    addNumber();
    addNumber();
}

const changed = (oldBoard, board) => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (oldBoard[i][j] != board[i][j]) return true;
        }
    }
    return false;
}

const move = (e) => {

    // let changed;
    let code = e.key;
    let oldBoard = board.map(arr => arr.slice());
    // console.table(oldBoard);

    switch (code) {
        // case 'ArrowDown': changed = slideDown(); break;
        // case 'ArrowUp': changed = slideUp(); break;
        // case 'ArrowLeft': changed = slideLeft();break;
        // case 'ArrowRight': changed = slideRight(); break;

        case 'ArrowDown': slideDown(); break;
        case 'ArrowUp': slideUp(); break;
        case 'ArrowLeft': slideLeft();break;
        case 'ArrowRight': slideRight(); break;
    }

    if (won())  {
        setTimeout(() => console.log("Game Over"), 200);
        return;
    }

    if (changed(oldBoard, board)) {
        addNumber();
        updateBoard();
        // console.table(board.map(arr => arr.slice()));

    }

    if (gameOver())  setTimeout(() => console.log("Game Over"), 200);
}

const auto = () => {

    let i = 0;
    let j = 0;

    do {

        let direction = Math.floor(Math.random() * size);
        let oldBoard = board.map(arr => arr.slice());

        switch (direction) {
            case 0: slideDown(); break;
            case 1: slideUp(); break;
            case 2: slideLeft();break;
            case 3: slideRight(); break;
        }
    
        if (won())  {
            console.log("Game Over", i, j);
            updateBoard();    
            return;
        }
    
        if (changed(oldBoard, board)) {
            addNumber();
            // updateBoard();    
        }
    
        if (gameOver())  {

            j++;
            
            // console.log("Game Over", i);
            initBoard();  
            i = 0;  
            continue;
        }

        i++;

    } while (!won());

    updateBoard();    

}

const enableMoves = () => document.addEventListener('keydown', move);

const updateBoard = () => {

    const board1d = board.flat();

    document.querySelectorAll('.tile').forEach((tile, i) => {
        tile.innerText = board1d[i] == 0 ? '' : board1d[i];
    });
}

const addNumber = () => {

    // let i, j;
    let freeCells = [];

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

    let [i, j] = freeCells[Math.floor(Math.random() * freeCells.length)];

    board[i][j] = Math.random() <= 0.1 ? 4 : 2;
}

const compress = vector => vector.filter(Boolean);

const combine = (vector) => {

    for (let i = 0; i < vector.length - 1; i++) {
        if (vector[i] == vector[i + 1]) {
            vector[i] *= 2;
            // if (vector[i] == 2048) win();
            vector[i + 1] = 0;
            score += vector[i];
        }
    }

    return vector;
}

const slide = (vector) => {
    
    vector = compress(vector);

    // if (array.length > 0) {
    //   for (let i = 0; i < array.length - 1; i++) {
    //     if (array[i] == array[i + 1]) {
    //       array[i] *= 2;
    //       array[i + 1] = 0;
    //     }
    //   }  
    // } 

    vector = combine(vector);

    vector = compress(vector);

    while (vector.length < size) vector.push(0);

    return vector;
}

const flip = () => {
    // for (let y = 0; y < size; y++) {
    //     for (let xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
    //       [board[y][xLeft], board[y][xRight]] = [board[y][xRight], board[y][xLeft]];
    //     }
    // }

    for (let i = 0; i < size; i++) {
        board[i].reverse();
    }


}

const transpose = () => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < i; j++) {
            [board[i][j], board[j][i]] = [board[j][i], board[i][j]];
        }
    }
}

const slideLeft = () => {

    // let changed = false;

    for (let i = 0; i < size; i++) {

        // let oldBoard = board.slice();

        board[i] = slide(board[i]);

        // changed = changed || (board[i].join(',') != oldBoard[i].join(','));
    }

    // return changed;
}

const slideRight = () => {
    flip();
    // let changed = slideLeft();
    slideLeft();

    flip();
    // return changed;
}


const slideUp = () => {
    transpose();
    // let changed = slideLeft();
    slideLeft();

    transpose();
    // return changed;
}

const slideDown = () => {
    transpose();
    // let changed = slideRight();
    slideRight();

    transpose();
    // return changed;
}

const won = () => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j] == 2048) return true;
        }
      }
      return false;
}

const gameOver = () => {

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

const init = () => {

    initBoard();
    setBoardSize();
    updateBoard();
    showBoard();
    enableMoves();

    // auto();
}

window.onload = () => document.fonts.ready.then(init()); 