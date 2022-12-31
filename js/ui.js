let startX, startY;
let swiped = false;
let sliding = false;
let touchEnd = false;
let touchID;

const showBoard = () => document.querySelector('body').style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

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

    num == 2048 ? tile.classList.add('tile2048') : tile.classList.add('tile');

    tile.id = `t${i * size + j}`;
    tile.innerText = num;
    tile.style.backgroundColor = `var(--color${parseInt(tile.innerText)})`;

    return tile;
}

const placeTile = (i, j, num) => {

    const cell = document.querySelectorAll('.cell')[i * size + j];
    const tile = newTile(i, j, num);
    const offsetTop = cell.offsetTop;
    const offsetLeft = cell.offsetLeft;

    tile.style.top = `${offsetTop}px`;
    tile.style.left = `${offsetLeft}px`;
    tile.style.display = 'grid';
    tile.classList.add('appear');

    tile.addEventListener('animationend', e => {

        let tile = e.currentTarget;

        tile.style.opacity = 1;
        tile.classList.remove('appear');

    }, {once: true});
}

const initPlacement = () => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] != 0) placeTile(i, j, board[i][j]);
        }
    }
}

const slideTiles = (boardxy) => {

    let nTiles = 0;

    const cells = document.querySelectorAll('.cell');

    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('pop'));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            if (boardxy[i][j] != 0 && (boardxy[i][j].x != i || boardxy[i][j].y != j)) {

                const cell = cells[i * size + j];
                const tile = document.querySelector(`#t${boardxy[i][j].x * size + boardxy[i][j].y}`);

                nTiles++;
                sliding = true;

                if (tile.classList.contains('appear')) tile.style.animationDuration = '0.1s';

                tile.style.top = `${cell.offsetTop}px`;
                tile.style.left = `${cell.offsetLeft}px`;

                tile.i = i;
                tile.j = j;

                tile.addEventListener('transitionend', e => {

                    let tile = e.currentTarget;

                    nTiles--;

                    if (nTiles == 0) sliding = false;
                    if (!sliding && !aiMode() && !touchScreen() && !win(board)) setTimeout(enableKeys, 0);
                    if (!sliding && !aiMode() && touchScreen() && touchEnd) setTimeout(enableTouch, 0);

                    tile.id = `t${tile.i * size + tile.j}`;
                    tile.style.animationDuration = '';

                }, {once: true});
            }

            if (boardxy[i][j].x2 != undefined && (boardxy[i][j].x2 != i || boardxy[i][j].y2 != j)) {

                const cell = cells[i * size + j];
                const tile = document.querySelector(`#t${boardxy[i][j].x2 * size + boardxy[i][j].y2}`);
                const tile2 = document.querySelector(`#t${boardxy[i][j].x * size + boardxy[i][j].y}`);

                nTiles++;
                sliding = true;

                if (tile.classList.contains('appear')) tile.style.animationDuration = '0.1s';

                tile.style.zIndex = 100;
                tile.style.top = `${cell.offsetTop}px`;
                tile.style.left = `${cell.offsetLeft}px`;

                tile.i = i;
                tile.j = j;

                tile.addEventListener('transitionend', e => {

                    nTiles--;
                
                    if (nTiles == 0) sliding = false;
                    if (!sliding && !aiMode() && !touchScreen() && !win(board)) setTimeout(enableKeys, 0); //
                    if (!sliding && !aiMode() && touchScreen() && touchEnd) setTimeout(enableTouch, 0);

                    tile2.remove();

                    let tile = e.currentTarget;

                    tile.innerText = boardxy[tile.i][tile.j].value;
                    tile.style.backgroundColor = `var(--color${parseInt(tile.innerText)})`;
                    tile.id = `t${tile.i * size + tile.j}`;
                    tile.style.animationDuration = '';

                    if (!win(board)) tile.classList.add('pop');

                    tile.style.zIndex = 'auto';
                }, {once: true});

                tile.addEventListener('animationend', e => {

                    let tile = e.currentTarget;

                    tile.classList.remove('pop');

                }, {once: true});
            }
        }
    }
}

const swipe = (e) => {

    let n = 0;

    while (e.touches[n].identifier != touchID && n < e.touches.length) n++;

    let currentX = e.touches[n].clientX;
    let currentY = e.touches[n].clientY;
    let dx = currentX - startX;
    let dy = currentY - startY;
    let absDx = Math.abs(dx);
    let absDy = Math.abs(dy);

    if (!swiped && Math.max(absDx, absDy) > 20) {

        let direction = absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');

        swiped = true;

        document.querySelector('.board').removeEventListener('touchmove', swipe);

        move(direction);
    }
}

const show2048 = () => {

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

        document.querySelector('.board').style.borderColor = 'var(--color2048)';

        tile.style.borderRadius = screen.height > 460 && screen.width > 460 ? '10px' : '7px';
        tile.style.transition = 'opacity 0s ease-in-out, border-radius 0.5s ease-in-out';
        tile.classList.add('zoom2048');

    }, 40);

    setTimeout(() => tile.style.opacity = 1, 90);

    tile.addEventListener('animationend', e => {

        let tile = e.currentTarget;

        document.querySelectorAll('.tile').forEach(tile => tile.remove());

        tile.style.transition = "opacity 1s";

        const enableKeys = () => document.addEventListener('keydown', e => {

            switch (e.code) {
                case 'Escape': case 'Enter': case 'Space':
                    newGame();
                    break;
                default:
                    enableKeys();
            }
        }, {once: true});

        touchScreen() ? setTimeout(tile.addEventListener('touchstart', newGame, {once: true}), 500) : enableKeys();

    }, {once: true});
}

const lostFire = () => {

    document.querySelectorAll('.tile').forEach(tile => tile.classList.add('lost'));

    setTimeout(() => {
        document.querySelector('.board').addEventListener('touchstart', e => {
            document.querySelector('.board').removeEventListener('touchmove', swipe);
            newGame();
        }, {once: true});

    }, 600)
}

const clearBoard = () => {

    document.querySelector('.board').removeAttribute('style');

    document.querySelectorAll('.tile, .tile2048').forEach(tile => {
        tile.style.transition = "opacity 1s";
    });

    document.querySelectorAll('.tile, .tile2048').forEach(tile => {

        tile.style.opacity = 0;

        tile.addEventListener('transitionend', e => {
            e.currentTarget.remove();
        }, {once: true});
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
    
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const enableKeys = () => document.addEventListener('keydown', e => {

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
            newGame();
            break;
        default:
            enableKeys();
    }
}, {once: true});

const setTouchStart = () => document.querySelector('.board').addEventListener('touchstart', e => {

        touchEnd = false;
        swiped = false;
        touchID = e.touches[e.touches.length - 1].identifier;
        startX = e.touches[e.touches.length - 1].clientX;
        startY = e.touches[e.touches.length - 1].clientY;

        document.querySelector('.board').addEventListener('touchmove', swipe);

        setTouchEnd();

}, {once: true});

const setTouchEnd = () => document.querySelector('.board').addEventListener('touchend', e => {

        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier == touchID) {
                setTouchEnd();
                return;
            }
        }
           
        sliding ? touchEnd = true : setTimeout(enableTouch, 0);

        document.querySelector('.board').removeEventListener('touchmove', swipe);

}, {once: true});

const enableTouch = () => {

    if (win(board) || lost(board)) return;

    sliding = false;

    setTouchStart();
}