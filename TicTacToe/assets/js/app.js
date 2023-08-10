let $ = document;

let currentPlayer = "X";
let currentPlayerShow = $.getElementById("currentPlayer");
let allGamePad = $.querySelectorAll(".pad-item");

let winningPlaces = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let gameBoard = {
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
};

function checkSameness(firstKey, secondKey, thirdKey) {
  return (
    gameBoard[firstKey] === gameBoard[secondKey] &&
    gameBoard[secondKey] === gameBoard[thirdKey] &&
    gameBoard[thirdKey] != ""
  );
}

function changePlayer() {
  if (currentPlayer === "X") {
    currentPlayer = "O";
    currentPlayerShow.classList.add("oMove");
  } else {
    currentPlayerShow.classList.remove("oMove");
    currentPlayerShow.classList.add("xMove");
    currentPlayer = "X";
  }
  currentPlayerShow.innerHTML = currentPlayer;
}

function updateGameBoard(padKey, move) {
  gameBoard[padKey] = move;
}

function checkWin() {
  winningPlaces.every(function (winningPlace) {
    if (checkSameness(winningPlace[0], winningPlace[1], winningPlace[2])) {
      win(winningPlace);
      return false;
    }
    return true;
  });
}

function win(winningLine) {
  console.log(currentPlayer, " Wins!");
  console.log(winningLine);
  winningLine.forEach(function (item) {
    allGamePad[item].classList.add("winLine");
    allGamePad[item].style.animation = "gelatineWin 0.5s 1";
  });
  allGamePad.forEach(function (gamePad) {
    gamePad.classList.add("deActive");
    gamePad.removeEventListener("click", playerMove);
  });
}

function updatePadItem(padItem) {
  let mainClass = "";
  if (currentPlayer === "X") {
    mainClass = "xMoveBg";
  } else {
    mainClass = "oMoveBg";
  }
  padItem.style.display = "block";
  padItem.style.animation = "gelatine 0.7s 1";
  padItem.classList.add(mainClass);
}

function playerMove(e) {
  let currentPad = e.target;
  let padIcon = e.target.children[0];
  let padIconKey = padIcon.dataset.padKey;
  currentPad.classList.add("deActive");
  updateGameBoard(padIconKey, currentPlayer);
  checkWin();
  updatePadItem(padIcon);
  currentPad.removeEventListener("click", playerMove);
  changePlayer();
}

allGamePad.forEach(function (item) {
  item.addEventListener("click", playerMove);
});

// ! ON change reload site
