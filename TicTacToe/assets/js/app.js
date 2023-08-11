let $ = document;

let currentPlayer = "";
let currentPlayerShow = $.getElementById("currentPlayer");
let currentPlayerWin = $.getElementById("currentPlayerAnnounce");
let winnerTextAnnounce = $.getElementById("winnerText");
let allGamePad = $.querySelectorAll(".pad-item");
let resetBtn = $.getElementById("reset");

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
  updatePadItem(padIcon);
  currentPad.removeEventListener("click", playerMove);
  let winStatus = checkWin();
  if (checkEndGame() && winStatus) {
    winnerTextAnnounce.innerHTML = `<span class="tieGame">No place left, Game is Tie! &nbsp;<i class='bi bi-emoji-dizzy-fill'></i></span>`;
    winnerTextAnnounce.classList.remove("opacity-0");
    winnerTextAnnounce.style.animationDelay = "0.5";
    winnerTextAnnounce.style.animation = "fade-in-left 1s ease 1";
    winnerTextAnnounce.classList.add("text-warning");
  }
  if (winStatus) {
    changePlayer();
  }
}

function pageLoad() {
  let starterPlayer = setStarter();
  currentPlayer = starterPlayer;
  changePlayer();
}

function resetGame() {
  pageLoad();
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
  winnerTextAnnounce.classList.remove("text-warning");
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

window.onload = pageLoad();

allGamePad.forEach(function (item) {
  item.addEventListener("click", playerMove);
});
resetBtn.addEventListener("click", resetGame);

// ! ON change reload site
