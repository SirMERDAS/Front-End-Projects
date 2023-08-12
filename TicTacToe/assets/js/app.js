let $ = document;

let currentPlayer = "";
let currentPlayerShow = $.getElementById("currentPlayer");
let currentPlayerWin = $.getElementById("currentPlayerAnnounce");
let winnerTextAnnounce = $.getElementById("winnerText");
let allGamePad = $.querySelectorAll(".pad-item");
let resetBtn = $.getElementById("reset");
let gamePerson = $.getElementById("gameModePerson");
let gameCpu = $.getElementById("gameModeCpu");
let gameMode = $.getElementById("gameMode");
let gameModeAnnounce = $.getElementById("mode");
let movesName = $.getElementById("movesAnnounce");

let cpuMove = "O";
let personMove = "X";

let mainMode = "";

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

function setStarter() {
  let players = ["X", "O"];
  let randomNum = Math.floor(Math.random() * 2);
  return players[randomNum];
}

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
  currentPlayerShow.style.animationDelay = "0.5s";
  currentPlayerShow.style.animation = "gelatine 0.5s 1";
}

function checkEndGame() {
  let counter = 0;
  for (const [key, value] of Object.entries(gameBoard)) {
    if (value === "") {
      counter += 1;
    }
  }
  if (counter === 0) {
    return true;
  }
  return false;
}

function updateGameBoard(padKey, move) {
  gameBoard[padKey] = move;
}

function checkWin() {
  let res = winningPlaces.every(function (winningPlace) {
    if (checkSameness(winningPlace[0], winningPlace[1], winningPlace[2])) {
      win(winningPlace);
      return false;
    }
    return true;
  });

  return res;
}

function win(winningLine) {
  winnerTextAnnounce.innerText = "";
  winnerTextAnnounce.insertAdjacentHTML("afterbegin", "Player");
  winnerTextAnnounce.insertAdjacentHTML(
    "beforeend",
    `                  <span
  class="fw-bolder fs-3"
  id="currentPlayerAnnounce"
>${currentPlayer}</span>`
  );
  winnerTextAnnounce.insertAdjacentHTML(
    "beforeend",
    `&nbspWins!&nbsp;<i class="bi bi-emoji-heart-eyes-fill"></i>`
  );
  winnerTextAnnounce.classList.remove("opacity-0");
  winnerTextAnnounce.style.animationDelay = "0.5";
  winnerTextAnnounce.style.animation = "fade-in-left 1s ease 1";
  if (currentPlayer === "X") {
    winnerTextAnnounce.classList.add("xMove");
  } else {
    winnerTextAnnounce.classList.add("oMove");
  }
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
  if (currentPlayer === personMove) {
    mainClass = "xMoveBg";
  } else {
    mainClass = "oMoveBg";
  }
  padItem.style.display = "block";
  padItem.style.animation = "gelatine 0.7s 1";
  padItem.classList.add(mainClass);
}

function checkEasyWin() {
  let easyWinning = [
    [1, 2, 3, 6, 4, 8, true, true, 0],
    [0, 2, 7, 4, true, true, true, true, 1],
    [0, 1, 5, 8, 6, 4, true, true, 2],
    [4, 5, 0, 6, true, true, true, true, 3],
    [0, 8, 1, 7, 2, 6, 3, 5, 4],
    [2, 8, 3, 4, true, true, true, true, 5],
    [0, 3, 7, 8, 2, 4, true, true, 6],
    [1, 4, 6, 8, true, true, true, true, 7],
    [0, 4, 2, 5, 6, 7, true, true, 8],
  ];

  let returningValue = false;

  easyWinning.forEach(function (easyWin) {
    if (
      (gameBoard[easyWin[0]] === gameBoard[easyWin[1]] &&
        gameBoard[easyWin[1]] == cpuMove &&
        gameBoard[easyWin[8]] == "") ||
      (gameBoard[easyWin[2]] === gameBoard[easyWin[3]] &&
        gameBoard[easyWin[3]] == cpuMove &&
        gameBoard[easyWin[8]] == "") ||
      (gameBoard[easyWin[4]] === gameBoard[easyWin[5]] &&
        gameBoard[easyWin[5]] == cpuMove &&
        gameBoard[easyWin[8]] == "") ||
      (gameBoard[easyWin[6]] === gameBoard[easyWin[6]] &&
        gameBoard[easyWin[7]] == cpuMove &&
        gameBoard[easyWin[8]] == "")
    ) {
      returningValue = easyWin[8];
    }
  });

  return returningValue;
}

function checkDefeat() {
  let returningValue = false;

  if (
    (gameBoard[1] === gameBoard[2] &&
      gameBoard[2] == personMove &&
      gameBoard[0] != cpuMove) ||
    (gameBoard[3] === gameBoard[6] &&
      gameBoard[6] == personMove &&
      gameBoard[0] != cpuMove) ||
    (gameBoard[4] === gameBoard[8] &&
      gameBoard[8] == personMove &&
      gameBoard[0] != cpuMove)
  ) {
    returningValue = 0;
  } else if (
    (gameBoard[0] === gameBoard[2] &&
      gameBoard[2] == personMove &&
      gameBoard[1] != cpuMove) ||
    (gameBoard[7] === gameBoard[4] &&
      gameBoard[4] == personMove &&
      gameBoard[1] != cpuMove)
  ) {
    returningValue = 1;
  } else if (
    (gameBoard[0] === gameBoard[1] &&
      gameBoard[1] == personMove &&
      gameBoard[2] != cpuMove) ||
    (gameBoard[5] === gameBoard[8] &&
      gameBoard[8] == personMove &&
      gameBoard[2] != cpuMove) ||
    (gameBoard[4] === gameBoard[6] &&
      gameBoard[6] == personMove &&
      gameBoard[2] != cpuMove)
  ) {
    returningValue = 2;
  } else if (
    (gameBoard[0] === gameBoard[6] &&
      gameBoard[6] == personMove &&
      gameBoard[3] != cpuMove) ||
    (gameBoard[4] === gameBoard[5] &&
      gameBoard[5] == personMove &&
      gameBoard[3] != cpuMove)
  ) {
    returningValue = 3;
  } else if (
    (gameBoard[0] === gameBoard[8] &&
      gameBoard[8] == personMove &&
      gameBoard[4] != cpuMove) ||
    (gameBoard[1] === gameBoard[7] &&
      gameBoard[7] == personMove &&
      gameBoard[4] != cpuMove) ||
    (gameBoard[2] === gameBoard[6] &&
      gameBoard[6] == personMove &&
      gameBoard[4] != cpuMove) ||
    (gameBoard[3] === gameBoard[5] &&
      gameBoard[5] == personMove &&
      gameBoard[4] != cpuMove)
  ) {
    returningValue = 4;
  } else if (
    (gameBoard[2] === gameBoard[8] &&
      gameBoard[8] == personMove &&
      gameBoard[5] != cpuMove) ||
    (gameBoard[3] === gameBoard[4] &&
      gameBoard[4] == personMove &&
      gameBoard[5] != cpuMove)
  ) {
    returningValue = 5;
  } else if (
    (gameBoard[0] === gameBoard[3] &&
      gameBoard[3] == personMove &&
      gameBoard[6] != cpuMove) ||
    (gameBoard[2] === gameBoard[4] &&
      gameBoard[4] == personMove &&
      gameBoard[6] != cpuMove) ||
    (gameBoard[7] === gameBoard[8] &&
      gameBoard[8] == personMove &&
      gameBoard[6] != cpuMove)
  ) {
    returningValue = 6;
  } else if (
    (gameBoard[1] === gameBoard[4] &&
      gameBoard[4] == personMove &&
      gameBoard[7] != cpuMove) ||
    (gameBoard[6] === gameBoard[8] &&
      gameBoard[8] == personMove &&
      gameBoard[7] != cpuMove)
  ) {
    returningValue = 7;
  } else if (
    (gameBoard[2] === gameBoard[5] &&
      gameBoard[5] == personMove &&
      gameBoard[8] != cpuMove) ||
    (gameBoard[6] === gameBoard[7] &&
      gameBoard[7] == personMove &&
      gameBoard[8] != cpuMove)
  ) {
    returningValue = 8;
  }
  return returningValue;
}

function getPlace() {
  let checkWin = checkEasyWin();
  let mainSides = [0, 2, 6, 8];

  let mainPlace = 20;
  if (checkWin) {
    mainPlace = checkWin;
  } else {
    let checkLose = checkDefeat();
    if (checkLose) {
      mainPlace = checkLose;
    } else {
      mainSides.every(function (side) {
        if (gameBoard[side] != cpuMove && gameBoard[side] != personMove) {
          mainPlace = side;
          return false;
        }
        return true;
      });
      if (mainPlace == 20) {
        if (gameBoard[4] != cpuMove && gameBoard[4] != personMove) {
          mainPlace = 4;
        } else {
          let secondSides = [1, 3, 5, 7];
          secondSides.every(function (side) {
            if (gameBoard[side] != cpuMove && gameBoard[side] != personMove) {
              mainPlace = side;
              return false;
            }
            return true;
          });
        }
      }
    }
  }
  return mainPlace;
}

function makeCpuMove() {
  if (mainMode == "pVc") {
    let cpuPlace = getPlace();
    let padItem = allGamePad[cpuPlace];
    let padIcon = padItem.children[0];
    padItem.classList.add("deActive");
    currentPlayer = cpuMove;
    updateGameBoard(cpuPlace, cpuMove);
    updatePadItem(padIcon);
    padItem.removeEventListener("click", playerMove);
    let winStatus = checkWin();
    if (checkEndGame() && winStatus) {
      winnerTextAnnounce.innerHTML = `<span class="tieGame">No place left, Game is Tie! &nbsp;<i class='bi bi-emoji-dizzy-fill'></i></span>`;
      winnerTextAnnounce.classList.remove("opacity-0");
      winnerTextAnnounce.style.animationDelay = "0.5";
      winnerTextAnnounce.style.animation = "fade-in-left 1s ease 1";
      winnerTextAnnounce.classList.add("text-primary");
    }
    if (winStatus) {
      changePlayer();
    }
  }
}

function playerMove(e) {
  let currentPad = e.target;
  let padIcon = e.target.children[0];
  let padIconKey = padIcon.dataset.padKey;
  currentPad.classList.add("deActive");
  updateGameBoard(padIconKey, currentPlayer);
  updatePadItem(padIcon);
  currentPad.removeEventListener("click", playerMove);
  let winStatus = checkWin();
  if (checkEndGame() && winStatus) {
    winnerTextAnnounce.innerHTML = `<span class="tieGame">No place left, Game is Tie! &nbsp;<i class='bi bi-emoji-dizzy-fill'></i></span>`;
    winnerTextAnnounce.classList.remove("opacity-0");
    winnerTextAnnounce.style.animationDelay = "0.5";
    winnerTextAnnounce.style.animation = "fade-in-left 1s ease 1";
    winnerTextAnnounce.classList.add("text-primary");
  }
  if (winStatus) {
    changePlayer();
    if (mainMode == "pVc") {
      makeCpuMove();
    }
  }
}

function pageLoad() {
  let starterPlayer = setStarter();
  currentPlayer = starterPlayer;
  changePlayer();
  if (currentPlayer == cpuMove) {
    if (mainMode == "pVc") {
      makeCpuMove();
    }
  }
}

function selectGameMode(e) {
  if (e.target.dataset.gameMode == "pVp") {
    gameModeAnnounce.innerText = "Person VS Person";
  } else {
    movesName.style = "height: 100%;opacity:1;";
    gameModeAnnounce.innerText = "Person VS CPU";
  }
  gameMode.style = "height: 0 !important;opacity:0;";
  mainMode = e.target.dataset.gameMode;

  pageLoad();
}

function resetGame() {
  gameMode.style = "height: 100% !important;opacity:1;";
  movesName.style = "height: 0%;opacity:0;";
  mainMode = "";
  allGamePad.forEach(function (gamePad) {
    gamePad.classList.remove("deActive");
    gamePad.classList.remove("winLine");
    gamePad.children[0].style = "";
    gamePad.children[0].className = "pad-icon";
    gamePad.addEventListener("click", playerMove);
  });
  winnerTextAnnounce.innerHTML = "&nbsp;&nbsp;&nbsp;";
  winnerTextAnnounce.classList.remove("xMove");
  winnerTextAnnounce.classList.add("opacity-0");
  winnerTextAnnounce.classList.remove("oMove");
  winnerTextAnnounce.classList.remove("text-primary");
  winnerTextAnnounce.style.animation = "";
  gameBoard = {
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
}

// window.onload = pageLoad();
allGamePad.forEach(function (item) {
  item.addEventListener("click", playerMove);
});
resetBtn.addEventListener("click", resetGame);
gameCpu.addEventListener("click", selectGameMode);
gamePerson.addEventListener("click", selectGameMode);

// ! ON change reload site
