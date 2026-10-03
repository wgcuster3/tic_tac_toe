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

        const debug = document.querySelector("#debug");
        debug.textContent = boardWithCellValues
          .map((row) => row.map((v) => v || "-").join(" | "))
          .join("\n");
    };

    //Place player tokens on the board
    const placeToken = (row, column, playerToken) => {
        if (board[row][column].getValue() !== '') return false;

        board[row][column].setValue(playerToken);
        return true;
    }

    //Check if the given token fills any row, column, or diagonal
    const checkWin = (playerToken) => {
        console.log("checking win for " + playerToken);
        const lines = [];

        //Build each line as a list of [row, column] coordinates
        for (let i = 0; i < 3; i++){
            lines.push([[i, 0], [i, 1], [i, 2]]); //row i
            lines.push([[0, i], [1, i], [2, i]]); //column i
        }
        lines.push([[0, 0], [1, 1], [2, 2]]); //top-left to bottom-right
        lines.push([[0, 2], [1, 1], [2, 0]]); //top-right to bottom-left

        return lines.some((line) =>
          line.every(([row, column]) => board[row][column].getValue() === playerToken)
        );
    }

    //Check if the board is full
    const checkBoardFull = () => {
        return board.every(row => 
            row.every(cell => cell.getValue() !== ''));
    }

    //Provide an interface to interact with the game board
    return {displayBoard, placeToken, checkWin, checkBoardFull};
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

//This will control flow of the game
function gameController () {
    const board = gameBoard();

    const players = [
      { name: "Wicket", token: "X",},
      { name: "Bacchus", token: "O",},
    ];

  let activePlayer = players[Math.floor(Math.random() * 2)];
  
  const swapPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
  
  };
  
  const playRound = (row, column) => {
    console.log(`${activePlayer.name}'s turn!`);
    console.log(`placing token in row ${row}, column ${column}`); 
    
    if (!board.placeToken(row, column, activePlayer.token)) {
      console.log("That spot is taken!! Try again.");
      return;
    }

    board.displayBoard();

    //Check if player won
    //if (board.checkWin(activePlayer.token)){
    //    console.log(`${activePlayer.name} wins!!!`);
    //    return;
    //}

    //Check if board is full
    if (board.checkBoardFull()){
        console.log("No winners, board is full.")
        return;
    }

    swapPlayer();
  }
  
  return {playRound};
}

const game = gameController();

playRoundBtn = document.getElementById("playRound");

playRoundBtn.addEventListener("click", () => {
    const row = Math.floor(Math.random() * 3);
    const column = Math.floor(Math.random() * 3);
    game.playRound(row, column);
});