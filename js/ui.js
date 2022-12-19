let startX, startY;
let swiped = false;
let sliding = false;
let touchEnd = false;
let directions = ['up', 'right', 'down', 'left']; //

// let sliding = false;

const showBoard = () => document.querySelector('body').style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const lostFire = () => {
    document.querySelectorAll('.tile').forEach(tile => tile.classList.add('lost'));

    setTimeout(() => {
        document.querySelector('.board').addEventListener('touchstart', e => {
            document.querySelector('.board').removeEventListener('touchmove', swipe);
            newGame();
        }, { once: true });

    }, 600)
}

// const enableMoves = () => document.addEventListener('keydown', move);

// const updateBoard = (board) => {

//     const board1d = board.flat();

//     document.querySelectorAll('.cell').forEach((cell, i) => {
//         cell.innerText = board1d[i] == 0 ? '' : board1d[i];
//     });
// }

const setBoardSize = () => {

    let boardSize;

    if (screen.height > 460 && screen.width > 460) return;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / size) * size;
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / size) * size;
    }

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const newTile = (i, j, num) => {

    const cell16 = document.querySelector('#c15');
    const tile = document.createElement('div');
    cell16.after(tile);

    // tile.classList.add('tile')

    num == 2048 ? tile.classList.add('tile2048') : tile.classList.add('tile');
    tile.id = `t${i * size + j}`;
    tile.innerText = num;
    tile.style.backgroundColor = `var(--color${parseInt(tile.innerText)})`;

    return tile;
}

// const newTile2 = (i, j, num) => {

//     const cell16 = document.querySelector('#c15');
//     const tile = document.createElement('div'); 

//     tile.classList.add('tile2048'); 
//     tile.id = `t${i * size + j}`;
//     cell16.after(tile);
//     tile.innerText = num;
//     tile.style.backgroundColor = `var(--color${parseInt(tile.innerText)})`;
//     tile.style.color = 'white';

//     return tile;
// }

const initPlacement = () => {

    // const cells = document.querySelectorAll('.cell');

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            if (board[i][j] != 0) {

                placeTile(i, j, board[i][j]);

                // adds.push([i, j, board[i][j]]);   //

                // const tile = newTile(i, j, board[i][j]);
                // const cell = cells[i * size + j];
                // const offsetTop = cell.offsetTop;
                // const offsetLeft = cell.offsetLeft;

                // tile.style.top = `${offsetTop}px`;
                // tile.style.left = `${offsetLeft}px`;
                // tile.style.display = "grid";
                // tile.classList.add('appear');

                // tile.addEventListener('animationend', e => {

                //     let tile = e.currentTarget;

                //     tile.style.opacity = 1;
                //     tile.classList.remove('appear');
                // }, {once: true});
            }
        }
    }
}

const placeTile = (i, j, num) => {

    // adds.push([i, j, num]); //

    const cell = document.querySelectorAll('.cell')[i * size + j];
    const tile = newTile(i, j, num);
    const offsetTop = cell.offsetTop;
    const offsetLeft = cell.offsetLeft;

    tile.style.top = `${offsetTop}px`;
    tile.style.left = `${offsetLeft}px`;

    tile.style.display = "grid";
    tile.classList.add('appear');

    // setTimeout(() => { //
    //     // if (!touchScreen() && !aiMode() && !initial) enableKeys(); //
    //     // if (touchScreen() && !aiMode() && !initial) enableTouch(); //

    //     if (!aiMode() && !initial) {
    //         touchScreen() ? enableTouch() : enableKeys(); //
    //     }
    // }, 150); //



    tile.addEventListener('animationend', e => {

        let tile = e.currentTarget;

        tile.style.opacity = 1;
        tile.classList.remove('appear');

        // if (!touchScreen() && !aiMode() && !initial) enableKeys();

    }, { once: true });
}

// const stopAnimation = () => {

//     let tiles = document.querySelectorAll('.tile');

//     for (let tile of tiles) {
//         // if (tile.classList.contains('appear')) tile.style.webkitAnimationDuration='0.05s';
//         if (tile.classList.contains('appear')) tile.style.animationDuration='0.1s';

//     }
// }

const slideTiles = (boardxy) => {

    let nTiles = 0;

    const cells = document.querySelectorAll('.cell');

    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('pop'));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            if (boardxy[i][j] != 0 && (boardxy[i][j].x != i || boardxy[i][j].y != j)) {

                nTiles++;

                sliding = true;

                // console.log(nTiles);

                const cell = cells[i * size + j];
                const tile = document.querySelector(`#t${boardxy[i][j].x * size + boardxy[i][j].y}`);

                if (tile.classList.contains('appear')) tile.style.animationDuration = '0.1s';

                tile.style.top = `${cell.offsetTop}px`;
                tile.style.left = `${cell.offsetLeft}px`;

                tile.i = i;
                tile.j = j;

                tile.addEventListener('transitionend', e => {

                    let tile = e.currentTarget;

                    nTiles--;
                    // console.log(nTiles); //

                    // if (nTiles == 0 && !aiMode()) touchScreen() ? enableTouch() : enableKeys(); //

                    if (nTiles == 0) sliding = false;
                    if (!sliding && !aiMode() && !touchScreen() && !win(board)) setTimeout(enableKeys, 0);
                    // if (!sliding && !aiMode() && touchScreen() && touchEnd) lost(board) ? setTimeout(enableTouch, 700) : setTimeout(enableTouch, 0);
                    if (!sliding && !aiMode() && touchScreen() && touchEnd) setTimeout(enableTouch, 0, 'sliding');

                    tile.id = `t${tile.i * size + tile.j}`;
                    tile.style.animationDuration = '';

                }, { once: true });
            }

            if (boardxy[i][j].x2 != undefined && (boardxy[i][j].x2 != i || boardxy[i][j].y2 != j)) {

                nTiles++;

                sliding = true;

                // console.log(nTiles);

                const cell = cells[i * size + j];
                const tile = document.querySelector(`#t${boardxy[i][j].x2 * size + boardxy[i][j].y2}`);
                const tile2 = document.querySelector(`#t${boardxy[i][j].x * size + boardxy[i][j].y}`);

                if (tile.classList.contains('appear')) tile.style.animationDuration = '0.1s';

                tile.style.zIndex = 100;
                tile.style.top = `${cell.offsetTop}px`;
                tile.style.left = `${cell.offsetLeft}px`;

                tile.i = i;
                tile.j = j;

                tile.addEventListener('transitionend', e => {

                    nTiles--;
                    // console.log(nTiles); //

                    // if (nTiles == 0 && !aiMode()) touchScreen() ? enableTouch() : enableKeys(); //

                    if (nTiles == 0) sliding = false;
                    if (!sliding && !aiMode() && !touchScreen() && !win(board)) setTimeout(enableKeys, 0); //
                    // if (!sliding && !aiMode() && touchScreen() && touchEnd) lost(board) ? setTimeout(enableTouch, 700) : setTimeout(enableTouch, 0); //
                    if (!sliding && !aiMode() && touchScreen() && touchEnd) setTimeout(enableTouch, 0, 'sliding');

                    tile2.remove();

                    let tile = e.currentTarget;

                    tile.innerText = boardxy[tile.i][tile.j].value;
                    tile.style.backgroundColor = `var(--color${parseInt(tile.innerText)})`;
                    tile.id = `t${tile.i * size + tile.j}`;
                    tile.style.animationDuration = '';

                    if (!win(board)) tile.classList.add('pop');

                    // tile.classList.add('pop');

                    // if (parseInt(tile.innerText) != 2048) tile.classList.add('pop');

                    tile.style.zIndex = 'auto';
                }, { once: true });

                tile.addEventListener('animationend', e => {

                    let tile = e.currentTarget;

                    tile.classList.remove('pop');

                }, { once: true });
            }
        }
    }
}

const show2048 = () => {

    console.log(moves);  //
    console.log(adds); //
    // console.timeEnd(); //

    let x, y;

    outer: for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == 2048) {
                [y, x] = [i, j];
                break outer;
            }
        }
    }

    document.querySelectorAll('.tile').forEach(tile => {
        tile.style.transition = 'opacity 0.5s ease-in-out';
        tile.style.opacity = 0;
    });

    const cells = document.querySelectorAll('.cell');
    const tile = newTile(y, x, 2048);
    const offsetTop = cells[0].offsetTop;
    const offsetLeft = cells[0].offsetLeft;
    const dimension = cells[3].offsetLeft + cells[3].offsetWidth - cells[0].offsetLeft;
    const scale = cells[0].offsetWidth / dimension;

    tile.style.top = `${offsetTop}px`;
    tile.style.left = `${offsetLeft}px`;
    tile.style.width = `${dimension}px`;
    tile.style.height = `${dimension}px`;
    tile.style.transformOrigin = `${x * 33.33}% ${y * 33.33}%`;
    tile.style.transform = `scale(${scale})`;

    setTimeout(() => {

        document.querySelector('.board').style.borderColor = '#bc5854';

        tile.style.borderRadius = screen.height > 460 && screen.width > 460 ? '10px' : '7px';
        tile.style.transition = 'opacity 0s ease-in-out, border-radius 0.5s ease-in-out';
        tile.classList.add('zoom2048');

    }, 40);

    setTimeout(() => tile.style.opacity = 1, 90);

    tile.addEventListener('animationend', e => {

        let tile = e.currentTarget;

        document.querySelectorAll('.tile').forEach(tile => tile.remove());

        tile.style.transition = "opacity 1s";
        tile.addEventListener('touchstart', newGame, { once: true });
        // tile.addEventListener('mousedown', newGame, {once: true});

        const enableKeys = () => document.addEventListener('keydown', e => {

            // let code = e.code;
            // const event = new Event('mousedown');

            switch (e.code) {
                case 'Escape': case 'Enter': case 'Space':
                    // tile.dispatchEvent(event)
                    newGame();
                    break;
                default:
                    enableKeys();
            }
        }, { once: true });

        enableKeys();

        setTimeout(() => {
            // tile.addEventListener('mousedown', newGame, {once: true});
            const event = new Event('touchend');
            tile.dispatchEvent(event)
        }, 1500);

    }, { once: true });
}

const swipe = (e) => {

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;
    let dx = currentX - startX;
    let dy = currentY - startY;
    let absDx = Math.abs(dx);
    let absDy = Math.abs(dy);

    if (!swiped && Math.max(absDx, absDy) > 20) {

        let direction = absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');

        swiped = true;

        document.querySelector('.board').removeEventListener('touchmove', swipe);

        // if (lost(board)) directions = directions.filter(item => item != direction);

        // if (directions.length == 0) {
        //     setTimeout(newGame, 100);
        //     return;
        // }

        move(direction);
    }
}

const clearBoard = () => {

    directions = ['up', 'right', 'down', 'left']; //

    document.querySelector('.board').removeAttribute('style');

    document.querySelectorAll('.tile, .tile2048').forEach(tile => {
        tile.style.transition = "opacity 1s";
    });

    document.querySelectorAll('.tile, .tile2048').forEach(tile => {

        tile.style.opacity = 0;

        tile.addEventListener('transitionend', e => {
            e.currentTarget.remove();
        }, { once: true });
    });
}

const resetTiles = () => {

    const cells = document.querySelectorAll('.cell');

    document.querySelectorAll('.tile').forEach(tile => tile.remove());

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            if (board[i][j] == 0) continue;

            const tile = newTile(i, j, board[i][j])
            const offsetTop = cells[i * 4 + j].offsetTop;
            const offsetLeft = cells[i * 4 + j].offsetLeft;

            tile.style.top = `${offsetTop}px`;
            tile.style.left = `${offsetLeft}px`;
            tile.style.display = "grid";
            tile.style.opacity = 1;
        }
    }
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, { passive: false });
    document.body.addEventListener('mousedown', preventDefault, { passive: false });
}

const enableKeys = () => document.addEventListener('keydown', e => {

    // const code = e.code;

    switch (e.code) {
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
        case 'Escape': case 'Enter': case 'Space':
            // (lost(board)) ? newGame() : enableKeys();
            newGame();
            break;
        default:
            enableKeys();
    }
}, { once: true });

const enableTouch = (caller = "") => {

    // console.log(arguments.callee.caller.toString()); //
    // console.log(caller)

    console.log("ENABLETOUCH"); //

    if (win(board)) return;

    if (lost(board)) return;

    sliding = false;

    // const checkSlideEnd = () => {
    //     if (slideEnd) {
    //         clearInterval(checkSlideEnd);
    //         setTimeout(enableTouch, 0);
    //     }
    // };

    // const touchEnd = () => {

    //     console.log("TOUCHEND"); //
    //     console.log("-----"); //

    //     if (win(board)) return;

    //     // if (!swiped) console.log('NOT SWIPED');

    //     if (!swiped && lost(board)) {
    //         document.querySelector('.board').removeEventListener('touchmove', swipe);
    //         restartLost();
    //         return;
    //     }

    //     // if (touchScreen() && lost()) setTimeout(enableTouch, 100);

    //     if (touchScreen() && !swiped) enableTouch();

    // }

    // document.querySelector('.board').removeEventListener('touchend', touchEnd);

    // console.log("ENABLETOUCH"); //

    // if (lost(board)) {
    //     document.querySelector('.board').addEventListener('touchend', e => {
    //         document.querySelector('.board').removeEventListener('touchmove', swipe);
    //         newGame();
    //         return;
    //     }, {once: true});
    // }

    document.querySelector('.board').addEventListener('touchstart', e => {

        // sliding = false;

        touchEnd = false;

        console.log("TOUCHSTART"); //

        swiped = false;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

    }, { once: true });

    document.querySelector('.board').addEventListener('touchend', e => {

        console.log("TOUCHEND"); //
        console.log("-----"); //

        // if (win(board)) return;

        // if (!swiped) console.log('NOT SWIPED');

        // if (directions.length == 0) {
        //     setTimeout(newGame, 300);
        //     return;
        // }

        // if (!swiped && lost(board)) {
        //     document.querySelector('.board').removeEventListener('touchmove', swipe);
        //     newGame();
        //     return;
        // }

        // if (touchScreen() && lost()) setTimeout(enableTouch, 100);

        // slideEnd ? setTimeout(enableTouch, 0) : setTimeout(enableTouch, 100);

        sliding ? touchEnd = true : setTimeout(enableTouch, 0, 'enabletouch');

        // if (touchScreen() && !swiped) enableTouch();

        // if (touchScreen()) enableTouch();

        // do {} while (!slideEnd);

        // setTimeout(enableTouch, 100);

        // slideEnd = true;

        // setInterval(checkSlideEnd, 20);

    }, { once: true });


    // document.querySelector('.board').addEventListener('touchend', touchEnd);


    // document.querySelector('.board').addEventListener('touchend', e => {

    //     console.log("TOUCHEND"); //
    //     console.log("-----"); //

    //     if (win(board)) return;

    //     // if (!swiped) console.log('NOT SWIPED');

    //     if (!swiped && lost(board)) {
    //         document.querySelector('.board').removeEventListener('touchmove', swipe);
    //         restartLost();
    //         return;
    //     }

    //     // if (touchScreen() && lost()) setTimeout(enableTouch, 100);

    //     if (touchScreen() && !swiped) enableTouch();


    // });

    document.querySelector('.board').addEventListener('touchmove', swipe);
}