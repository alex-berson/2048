const size = 4;

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

const init = () => {

    setBoardSize();
    showBoard();
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
