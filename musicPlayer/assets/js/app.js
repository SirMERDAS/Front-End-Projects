const $ = document;
let musics = [
  { id: 1, name: "Egzod, Maestro Chives, Neoni - Royalty [NCS Release]" },
  { id: 2, name: "VOLT VISION, BRIGHTDVWN - Hide Your Heart [NCS Release]" },
  { id: 3, name: "Henri Werner - Burned [NCS Release]" },
];

let musicSeeker = $.querySelector("#musicSeeker");
let singerName = $.querySelector("#singerName");
let trackName = $.querySelector("#trackName");
let albumName = $.querySelector("#albumName");
let prevBtn = $.querySelector("#prevBtn");
let playBtn = $.querySelector("#playBtn");
let nextBtn = $.querySelector("#nextBtn");
let currentTime = $.querySelector("#currentTime");
let maxDuration = $.querySelector("#maxDuration");
let albumCover = $.querySelector("#albumCover");
let themeController = $.getElementById("toggleTheme");
let albumCoverBg = $.querySelector(".mainCoverBg");
let mainAudioHandler = $.querySelector("audio");
let volumeController = $.getElementById("audioVolume");
let volumeControllerText = $.getElementById("volumeText");
let musicStatus = false;
let trackNo = 0;

function playPause(e) {
  if (!musicStatus) {
    mainAudioHandler.play();

    musicStatus = true;
    setMusicPlayerStats();

    playBtn.children[0].className = "bi bi-pause-fill";
  } else {
    mainAudioHandler.pause();
    musicStatus = false;
    playBtn.children[0].className = "bi bi-play-fill";
  }
}

function setMusicPlayerStats() {
  let musicDuration = mainAudioHandler.duration;
  let musicDurationMinute = Math.floor(musicDuration / 60);
  let remainSeconds = (musicDuration % 60).toFixed(0);
  let mainDuration = musicDurationMinute + ":" + remainSeconds;
  maxDuration.innerHTML =
    mainDuration.length <= 4 ? "0" + mainDuration : mainDuration;
  let allTrackGet = $.querySelectorAll("li[data-track-id]");
  allTrackGet.forEach(function (item) {
    item.style.backgroundSize = "0%";
    item.children[0].style.display = "none";
  });
}

function setMusicCurrentStatus() {
  let musicDuration = mainAudioHandler.duration;
  let currentMusicTime = mainAudioHandler.currentTime;
  let musicDurationMinute = Math.floor(currentMusicTime / 60);
  let remainSeconds = (currentMusicTime % 60).toFixed(0);
  remainSeconds =
    remainSeconds.length == 1 ? "0" + remainSeconds : remainSeconds;
  let mainDuration = musicDurationMinute + ":" + remainSeconds;
  currentTime.innerHTML =
    mainDuration.length <= 4 ? "0" + mainDuration : mainDuration;
  let currentPercent = ((currentMusicTime / musicDuration) * 100).toFixed(2);
  musicSeeker.style.backgroundSize = currentPercent + "%";
  musicSeeker.value = currentPercent;

  let currentTrackId = mainAudioHandler.dataset.trackIdentifier;
  let getCurrentTrack = $.querySelector(
    `li[data-track-id='${currentTrackId}']`
  );
  getCurrentTrack.style = `
  background-repeat: no-repeat;
  background-image: linear-gradient( 259deg, #593ec5 0%, rgba(99, 66, 232, 0) 110% );
  `;
  getCurrentTrack.style.backgroundSize = currentPercent + "%";

  getCurrentTrack.children[0].style = "display:block !important";
  if (musicSeeker.value >= 99.5) {
    nextMusic();
  }
}

function goToMinute(e) {
  let musicDuration = mainAudioHandler.duration;
  let currentTimeSec = (e.target.value * musicDuration) / 100;
  mainAudioHandler.currentTime = currentTimeSec;

  setMusicCurrentStatus();
}

function removeAnimation(e) {
  e.target.style.animation = "";
}

function setTrackInfo() {
  let currentTrack = musics[trackNo];
  let rootPath = "assets/mainData/" + currentTrack.id + "/";
  let parseData = currentTrack.name.split("-");
  let imgSource = rootPath + currentTrack.id + ".png";
  mainAudioHandler.setAttribute("src", rootPath + currentTrack.name + ".mp3");
  mainAudioHandler.dataset.trackIdentifier = currentTrack.id;
  albumCover.setAttribute("src", imgSource);
  singerName.style.animation = "currentMusic 0.2s ease 1";
  albumCoverBg.style.backgroundImage = `url("${imgSource}")`;
  singerName.innerHTML = parseData[0];
  albumName.innerHTML = parseData[1] + " Album";
  trackName.innerHTML = parseData[1];
  singerName.style.animation = "nextMusicAnimation 0.9s ease 1";
  albumCover.style.animation = "coverImgLoader 0.7s ease 1";
  albumCoverBg.style.animation = "coverImgBg 1s ease 1";
  albumName.style.animation = "nextMusicAnimation 0.6s ease 1";
  trackName.style.animation = "nextMusicAnimation 0.2s ease 1";

  mainAudioHandler.onloadedmetadata = function () {
    setMusicPlayerStats();
  };
}

function nextMusic() {
  musicSeeker.value = 0;

  if (trackNo < musics.length - 1) {
    trackNo += 1;
    if (!mainAudioHandler.paused) {
      setTrackInfo();
      mainAudioHandler.play();
    } else {
      setTrackInfo();
    }
    mainAudioHandler.onloadedmetadata = function () {
      setMusicPlayerStats();
    };
  } else {
    trackNo = 0;
    if (!mainAudioHandler.paused) {
      setTrackInfo();
      mainAudioHandler.play();
    } else {
      setTrackInfo();
    }
    mainAudioHandler.onloadedmetadata = function () {
      setMusicPlayerStats();
    };
  }
}

function prevMusic() {
  if (trackNo != 0) {
    trackNo -= 1;
    if (!mainAudioHandler.paused) {
      setTrackInfo();
      mainAudioHandler.play();
    } else {
      setTrackInfo();
    }
    mainAudioHandler.onloadedmetadata = function () {
      setMusicPlayerStats();
    };
  } else {
    trackNo = musics.length - 1;
    if (!mainAudioHandler.paused) {
      setTrackInfo();
      mainAudioHandler.play();
    } else {
      setTrackInfo();
    }
    mainAudioHandler.onloadedmetadata = function () {
      setMusicPlayerStats();
    };
  }
}

function getTheme() {
  let currentTheme = "";

  currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    $.body.classList.add(currentTheme);
    if (currentTheme === "dark") {
      themeController.children[0].classList.add("darkModeToggle");
      themeController.children[0].children[0].className = "bi bi-moon-fill";
    } else {
      themeController.children[0].children[0].className = "bi bi-sun-fill";
    }
  } else {
    $.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

function changeTheme() {
  themeColor = localStorage.getItem("theme");
  if (themeColor === "dark") {
    themeController.children[0].classList.toggle("darkModeToggle");
    $.body.className = "light";
    themeController.children[0].children[0].style.transform = "rotate(360deg)";
    themeController.children[0].children[0].className = "bi bi-sun-fill";
    localStorage.setItem("theme", "light");
  } else {
    themeController.children[0].classList.toggle("darkModeToggle");
    $.body.className = "dark";
    themeController.children[0].children[0].style.transform = "rotate(0deg)";
    themeController.children[0].children[0].className = "bi bi-moon-fill";

    localStorage.setItem("theme", "dark");
  }
}

function controlVolume() {
  let volumeValue = volumeController.value;
  volumeController.style.backgroundSize = volumeValue + "%";
  volumeControllerText.innerText = volumeValue + " %";
  mainAudioHandler.volume = volumeValue / 100;
}

function removeLoader() {
  let mainLoader = $.querySelector(".preloader");
  mainLoader.classList.add("d-none");
}

function setMusicsList() {
  let allTracks = musics;
  let liContainer = $.createDocumentFragment();
  allTracks.forEach(function (track) {
    let item = $.createElement("li");
    item.className =
      "list-group-item d-flex  musicNameList py-2 align-items-center rounded-3 my-2 border-0 track_info";
    let parseData = track.name.split("-");
    item.dataset.trackId = track.id;
    item.innerText = track.id + "." + parseData[1];
    item.insertAdjacentHTML(
      "afterbegin",
      `<div class="spinner-grow d-none currentMusicSpinner" role="status"></div>&nbsp;`
    );

    liContainer.append(item);
    item.addEventListener("click", setMusic);
  });

  let trackListElem = $.getElementsByClassName("trackListsMenu");
  trackListElem[0].append(liContainer);
}
function setMusic(e) {
  let trackIdentifier = e.target.dataset.trackId;

  trackNo = trackIdentifier - 1;
  if (!mainAudioHandler.paused) {
    setTrackInfo();
    mainAudioHandler.play();
  } else {
    setTrackInfo();
  }
  mainAudioHandler.onloadedmetadata = function () {
    setMusicPlayerStats();
  };
}

function pageLoaded() {
  getTheme();
  setMusicsList();
  setTrackInfo();
  controlVolume();
  removeLoader();
}

Window.onload = pageLoaded();

nextBtn.addEventListener("click", nextMusic);
prevBtn.addEventListener("click", prevMusic);
playBtn.addEventListener("click", playPause);
singerName.addEventListener("animationend", removeAnimation);
albumName.addEventListener("animationend", removeAnimation);
trackName.addEventListener("animationend", removeAnimation);
albumCover.addEventListener("animationend", removeAnimation);
albumCoverBg.addEventListener("animationend", removeAnimation);
themeController.addEventListener("click", changeTheme);
musicSeeker.addEventListener("input", goToMinute);
volumeController.addEventListener("input", controlVolume);

setInterval(setMusicCurrentStatus, 500);
