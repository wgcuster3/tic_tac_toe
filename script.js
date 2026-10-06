function gameBoard(){
    const board = [];

    //Create a 2D array that represents the game board
    for (let i = 0; i < 3; i++){
        board[i] = [];
        for (let j = 0; j < 3; j++){
            board[i].push(cell());
        }
    }
        
    //Return the current state of the board
    const getBoard = () => board;

    //Display the board in its current state
    const displayBoard = () => {
        const boardWithCellValues = board.map((row) =>
          row.map((cell) => cell.getValue())
        );
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
    return {getBoard, displayBoard, placeToken, checkWin, checkBoardFull};
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
  
  const getActivePlayer = () => activePlayer;

  const swapPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
  
  };
  
  const playRound = (row, column, statusDiv) => {
    // Display player's turn
    statusDiv.textContent = `${activePlayer.name}'s turn...`;

    if (!board.placeToken(row, column, activePlayer.token)) {
      statusDiv.textContent = "That spot is taken!! Try again.";
      return;
    }

    board.displayBoard();

    //Check if player won
    if (board.checkWin(activePlayer.token)){
        statusDiv.textContent = `${activePlayer.name} wins!!!`;
        return;
    }

    //Check if board is full
    if (board.checkBoardFull()){
        statusDiv.textContent = "No winners, board is full.";
        return;
    }

    swapPlayer();
  }
  
  return {playRound, getActivePlayer, getBoard: board.getBoard};
}

function screenController() {
    const game = gameController();
    const statusDiv = document.getElementById("status");
    const boardDiv = document.getElementById("board");

    const drawScreen = () => {
      // clear the board
      boardDiv.textContent = "";

      // get the current version of the board
      const board = game.getBoard();

      // Render board squares
      board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");

          // Create a data attribute to identify the row and column
          cellButton.dataset.row = rowIndex;
          cellButton.dataset.column = colIndex;
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        });
      });
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedRow = e.target.dataset.row;
      const selectedCol = e.target.dataset.column;
      // Make sure I've clicked on a space and not the gaps in between
      if (!selectedRow) return;
      if (!selectedCol) return;

      game.playRound(selectedRow, selectedCol, statusDiv);
      drawScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    //Draw the initial screen
    drawScreen();

    return {drawScreen};
}

screenController();