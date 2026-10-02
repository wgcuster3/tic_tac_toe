function gameBoard(){
    console.log("made it");

    const board = [];

    //Create a 2D array that represents the game board
    for (let i = 0; i < 3; i++){
        board[i] = [];
        for (let j = 0; j < 3; j++){
            board[i].push(cell());
        }
    }
        
    //Display the board in its current state
    const displayBoard = () => {
        const boardWithCellValues = board.map((row) =>
          row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };

    //Provide an interface to interact with the game board
    return {displayBoard};
}

//this is what each cell on the gameboard will be
function cell() {
    let value = '';

    const setValue = (playerToken) => {
        value = playerToken;
    }

    const getValue = () => value;

    return{setValue, getValue};
}

const board = gameBoard();

console.log(board[1][0]);
board[1][0].setValue("X");
board[2][2].setValue("O");
board[1][1].setValue("X");
board[2][1].setValue("O");


board.displayBoard();