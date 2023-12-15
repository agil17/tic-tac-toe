const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector('.winner').innerHTML = message;
    }

    return {
        renderMessage
    }
})();

const Gameboard = (() => {
    let gameboard = ["","","","","","","","",""];

    const render = () => {
        let boardHtml = "";

        gameboard.forEach((square, index) => {
            boardHtml += `<div class="square" id="${index}">${square}</div>`;
        });
        document.querySelector('.gameboard').innerHTML = boardHtml;
        
        const squares = document.querySelectorAll('.square');
        squares.forEach((square) => {
            square.addEventListener('click', Game.handleClick);
        })

    }

    const getGameboard = () => gameboard;

    const update = (index, mark) => {
        gameboard[index] = mark;
        render();
    }

    return {
        render,
        update,
        getGameboard
    }
})();

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector('#player-1').value, "X"),
            createPlayer(document.querySelector('#player-2').value, "O"),
        ]

        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    }

    const handleClick = (event) => {
        if(gameOver) return;

        let index = parseInt(event.target.id);

        if(Gameboard.getGameboard()[index] !== "") return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if(checkForWin(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} has won!`);
        }
        else if(checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage(`It's a tie!`);
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const checkForWin = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [0, 4, 8]
        ]

        for(let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    }

    const checkForTie = (board) => {
        return board.every((cell) => cell !== "");
    }

    const restart = () => {
        for(let i = 0; i < Gameboard.getGameboard().length; i++) {
            Gameboard.update(i,"");
        }
        Gameboard.render();
        gameOver = false;
        document.querySelector('.winner').innerHTML="";
    }

    return {
        start,
        handleClick,
        checkForWin,
        checkForTie,
        restart
        
    }
})();

const startBtn = document.querySelector('.start');
startBtn.addEventListener('click', () => {
    Game.start();
});

const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', () => {
    Game.restart();
});
