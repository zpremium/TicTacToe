window.addEventListener("DOMContentLoaded", () => {
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const playerDisplay = document.querySelector(".display-player");
  const resetButton = document.querySelector("#reset");
  const announcer = document.querySelector(".announcer");

  let board = ["", "", "", "", "", "", "", "", ""]; //put every board in an array with no text on it
  let currentPlayer = "X"; //first player (me)
  let isGameActive = true;

  const PLAYERX_WON = "PLAYERX_WON";
  const PLAYERO_WON = "PLAYERO_WON";
  const TIE = "TIE";

  /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

  const winningConditions = [
    //Every possibility to win in Tic Tac Toe
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function handleResultValidation() {
    //Here we will check whether the game ended in a win, draw, or if there are still moves to be played.
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
      //In our for-loop, we go through each one and check whether the elements of our game state array under those indexes match. If they do match we move on to declare the current player as victorious and ending the game.
      const winCondition = winningConditions[i];
      const a = board[winCondition[0]];
      const b = board[winCondition[1]];
      const c = board[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON); //IF X WON THE GAME IS OVER, ELSE O WINS THE GAME IS OVER TOO
      isGameActive = false;
      return;
    }

    if (!board.includes("")) announce(TIE); //IF NOBODY WINS, IT MEANS IS A TIE => !BOARD > MEANS IF THE ENTIRE BOARD IS NOT EMPTY IT MEANS TIE
  }

  //Who's the winner??

  const announce = (type) => {
    //Tell under the board who won or it was a tie
    switch (type) {
      case PLAYERO_WON:
        announcer.innerHTML = 'Player <span class="playerO">O</span>  Won <br> <span class="playerO">O</span> will start the next game';
        break;
      case PLAYERX_WON:
        announcer.innerHTML = 'Player <span class="playerX">X</span>  Won <br> <span class="playerX">X</span> will start the next game';
        break;
      case TIE:
        announcer.innerText = "Tie";
    }
    announcer.classList.remove("hide"); //not show nothing unless the switch is true
  };

  const isValidAction = (tile) => {
    //
    if (tile.innerText === "X" || tile.innerText === "O") {
      return false;
    }

    return true;
  };

  //We update our internal game state to reflect the played move, as well as update the user interface to reflect the played move.
  const updateBoard = (index) => {
    board[index] = currentPlayer;
  };

  //let's change the player, first we have to remove the current player, then we will change our current player to be X (if it was O, viceversa) and update the player
  const changePlayer = () => {
    playerDisplay.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    playerDisplay.innerText = currentPlayer;
    playerDisplay.classList.add(`player${currentPlayer}`);
  };

  //represent a turn in the game, this functions is called when the user clicks on the tile; FIRST, we check is the step is a valid action and we will check whether is our game active or not, if both conditions are true, the game can continue with the X player or O player
  const userAction = (tile, index) => {
    if (isValidAction(tile) && isGameActive) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index);
      handleResultValidation();
      changePlayer();
    }
  };

  //reset the board as a new match, we put the board with no string, we say the game is active now and we hide the "announce"
  const resetBoard = () => {    
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    announcer.classList.add("hide");

    //the game will restart who won the last game;
    if (currentPlayer ? PLAYERX_WON : PLAYERO_WON) {
      changePlayer();
    }

    tiles.forEach((tile) => {
      //change everything to empty string and remove any player related classes
      tile.innerText = "";
      tile.classList.remove("playerX");
      tile.classList.remove("playerO");
    });
  };

  //when we click on a tile a user action function will be called with the reference to that specific tile and the index of it, we will use the tile reference to modify our UI and we will use the index to update in memory saved board array
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => userAction(tile, index));
  });

  resetButton.addEventListener("click", resetBoard);
});
