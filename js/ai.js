const mcs = (board, startTime, timeLimit) => {

    let directions = ['up','right','down','left'];
    let tries = {up:0, right:0, down:0, left:0};
    let scores = {up:0, right:0, down:0, left:0};

    do {

        let score = 0;
        let firstMove;
        let newBoard = board.map(arr => arr.slice());

        do {
            let direction = directions[Math.trunc(Math.random() * size)];
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
    
    } while (new Date() - startTime < timeLimit);

    let bestDirection;
    let bestScore = -Infinity;

    for (let dir of directions) {
        if (tries[dir] == 0) continue;
        if (scores[dir] / tries[dir] > bestScore) [bestDirection, bestScore] = [dir, scores[dir] / tries[dir]];
    }

    return bestDirection;
}