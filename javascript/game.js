// This is the variable that stores the player board
const playerBoard = document.getElementById("player-board");
const startButtonContainer = document.querySelector(".startButtonContainer");
const turnTextElement = document.querySelector("#turn-text");

//This is the function that create all the block in the playerfield
function CreateBoard(board, cellName) {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add(cellName);
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

CreateBoard(playerBoard, "cell");

//This are all the cell in the player field
const cellBlocks = document.querySelectorAll(".cell");
const enemyCellBlocks = document.querySelectorAll(".enemy-cell");

const _playerTurnString = "Your Turn!";
const _aiTurnString = "It's the enemy's turn";

//All boats you have in the game
let boats = [2, 3, 3, 4, 5];
let enemyBoats = [2, 3, 3, 4, 5];
let currentBoatSize = boats[0];
let isHorizontal = true;
let boatIsChoosed = false;
let currentHoveredCell = null;
let boatNumber = 0;
let gameIsStarted = false;
let isPlayerTurn = true;

let placedBoats = 0;

//This code rotates the boat with a specific button press
document.addEventListener("keydown", (event) => {
  if (
    event.key === "r" &&
    isHorizontal === true &&
    !gameIsStarted &&
    boatIsChoosed
  ) {
    highlightCells(currentHoveredCell, currentBoatSize, "#222");
    isHorizontal = false;
    highlightCells(currentHoveredCell, currentBoatSize, "grey");
  } else if (boatIsChoosed) {
    highlightCells(currentHoveredCell, currentBoatSize, "#222");
    isHorizontal = true;
    highlightCells(currentHoveredCell, currentBoatSize, "grey");
  }
});

//This code rotates the boat with the right mouse button press
//document.addEventListener("contextmenu", (event) => {
//  event.preventDefault();
//  if (isHorizontal === true) {
//    highlightCells(currentHoveredCell, currentBoatSize, "#222");
//    isHorizontal = false;
//    highlightCells(currentHoveredCell, currentBoatSize, "grey");
//  } else {
//    highlightCells(currentHoveredCell, currentBoatSize, "#222");
//    isHorizontal = true;
//    highlightCells(currentHoveredCell, currentBoatSize, "grey");
//  }
//});

function setCurrentBoat(boatId, newBoatNumber) {
  const pressedButton = document.getElementById(boatId);
  pressedButton.style.display = "none";

  const match = boatId.match(/\d+/);
  let boatIndex;

  if (match) {
    boatIndex = parseInt(match[0], 10);
  } else {
    throw new Error("Geen getal");
  }

  currentBoatSize = boats[boatIndex];
  boatIsChoosed = true;

  boatNumber = newBoatNumber;

  const replaceButton = document.getElementById(`replaceBoat${boatIndex}`);
  replaceButton.style.display = "flex";
}

function resetBoats() {
  placedBoats = 0;
  cellBlocks.forEach((cell) => {
    if (cell.classList.contains("placed")) {
      cell.classList.remove("placed");
      cell.style.backgroundColor = "#222";
    }
  });

  for (i = 0; i < 5; i++) {
    let button = document.getElementById(`chooseBoat${i}`);
    button.style.display = "flex";
    let replaceButton = document.getElementById(`replaceBoat${i}`);
    replaceButton.style.display = "none";
  }
}

//This code loops true all the cellBlock and add an eventlistener with click and if clicked it fires the PlaceBlock funtion
cellBlocks.forEach((cell) => {
  cell.addEventListener("mouseenter", () => {
    if (boatIsChoosed === true) {
      const cellIndex = parseInt(cell.dataset.index, 10);
      currentHoveredCell = cellIndex;
      if (!cell.classList.contains("placed")) {
        highlightCells(cellIndex, currentBoatSize, "grey");
      }
    }
  });

  cell.addEventListener("mouseleave", () => {
    const cellIndex = parseInt(cell.dataset.index, 10);
    const hoverCell = cellBlocks[cellIndex];
    if (!cell.classList.contains("placed")) {
      highlightCells(cellIndex, currentBoatSize, "#222");
    }
  });

  cell.addEventListener("click", () => {
    if (boatIsChoosed === true) {
      const cellIndex = parseInt(cell.dataset.index, 10);
      if (canPlaceBoat(cellIndex, currentBoatSize, isHorizontal, cellBlocks)) {
        placeBoat(cellIndex, currentBoatSize, boatNumber);
        currentBoatSize = boats[0]; // Update naar de volgende boot
        if (!currentBoatSize) {
        }
      } else {
      }
    }
  });
});

function highlightCells(startIndex, size, color) {
  // This code happens for all de divs (also the size)
  for (let i = 0; i < size; i++) {
    let cellIndex;

    if (isHorizontal) {
      cellIndex = startIndex + i;
    } else {
      cellIndex = startIndex + i * 10;
    }

    const cell = cellBlocks[cellIndex];

    if (cell != null && !cell.classList.contains("placed")) {
      cell.style.backgroundColor = color;
    }
  }
}

function highlightBomb(cellIndex, cellBlocks, color) {
  const cell = cellBlocks[cellIndex];

  if (cell != null) {
    cell.style.backgroundColor = color;
  }
}

function placeBomb(cellIndex, cellBlocks, color) {
  const cell = cellBlocks[cellIndex];

  if (cell) {
    if (cell.classList.contains("placed")) {
      cell.style.backgroundColor = "purple";
      cell.classList.add("bombed");
    } else {
      cell.classList.add("bombed");
      cell.style.backgroundColor = color;
    }
  }
}

function canPlaceBoat(startIndex, size, isHorizontal, cellBlocks) {
  const lineIndex = Math.floor(startIndex / 10);

  for (let i = 0; i < size; i++) {
    let cellIndex;

    if (isHorizontal) {
      cellIndex = startIndex + i;
    } else {
      cellIndex = startIndex + i * 10;
    }

    const cell = cellBlocks[cellIndex];

    if (!cell || cell.classList.contains("placed")) {
      return false; // Can't place the boats
    } else if (Math.floor(cellIndex / 10) != lineIndex && isHorizontal) {
      return false;
    }
  }
  return true;
}

//This function just maked the clicked block a red background color

function placeBoat(startIndex, size, boatNumber) {
  placedBoats++;

  for (let i = 0; i < size; i++) {
    let cellIndex;

    if (isHorizontal) {
      cellIndex = startIndex + i;
    } else {
      cellIndex = startIndex + i * 10;
    }

    const cell = cellBlocks[cellIndex];

    if (cell) {
      cell.classList.add("placed");
      cell.classList.add(`boat-${boatNumber}`);
      cell.style.backgroundColor = "red";
    }
  }
  boatIsChoosed = false;

  if (placedBoats === 5) {
    startButtonContainer.style.display = "block";
  }
}

function replaceBoat(boatNumber) {
  placedBoats--;
  cellBlocks.forEach((cell) => {
    if (cell.classList.contains(`boat-${boatNumber}`)) {
      cell.classList.remove(`boat-${boatNumber}`);
      cell.classList.remove("placed");
      cell.style.backgroundColor = "#222";
    }
  });

  if (placedBoats != 5) {
    startButtonContainer.style.display = "none";
  }

  setCurrentBoat(`chooseBoat${boatNumber}`, boatNumber);
}

function startGame() {
  const enemyBoard = document.getElementById("enemy-board");
  const chooseContainer = document.getElementById("choose-container");
  enemyBoard.style.display = "grid";
  chooseContainer.style.display = "none";

  //If the game start this boolean is true
  gameIsStarted = true;

  CreateBoard(enemyBoard, "enemy-cell");
  placeEnemyBoats();
  enableBombThrowing();
}

let colors = ["red", "blue", "orange", "pink", "green"];

function placeEnemyBoats() {
  // All cell blocks in one constant
  const enemyCellBlocks = document.querySelectorAll(".enemy-cell");

  for (let i = 0; i < 5; i++) {
    //boatSize is a random varible for the boat size that is placed
    let boatIndex = Math.floor(Math.random() * enemyBoats.length);
    let boatSize = enemyBoats[boatIndex];

    //This deletes the boat that is placed
    enemyBoats.splice(boatIndex, 1);

    let randomStartIndex = Math.floor(Math.random() * enemyCellBlocks.length);

    // This variable makes a random nuber between 0 and 1 and it is true under 0.5 that makes 50/50 change
    let randomDirectionBool = Math.random() < 0.5;

    do {
      randomStartIndex = Math.floor(Math.random() * enemyCellBlocks.length);
      randomDirectionBool = Math.random() < 0.5;
    } while (
      !canPlaceBoat(
        randomStartIndex,
        boatSize,
        randomDirectionBool,
        enemyCellBlocks,
      )
    );

    for (let i = 0; i < boatSize; i++) {
      let cellIndex;

      if (randomDirectionBool) {
        cellIndex = randomStartIndex + i;
      } else {
        cellIndex = randomStartIndex + i * 10;
      }

      const cell = enemyCellBlocks[cellIndex];

      if (cell) {
        cell.classList.add("placed");
        cell.classList.add(`boat-${boatNumber}`);
        cell.style.backgroundColor = colors[0];
      }
    }

    boatNumber++;
    colors.splice(0, 1);
  }

  turnTextElement.innerText = _playerTurnString;
}

function enableBombThrowing() {
  const enemyCellBlocks = document.querySelectorAll(".enemy-cell");

  if (isPlayerTurn) {
    enemyCellBlocks.forEach((cell) => {
      cell.addEventListener("mouseenter", () => {
        if (isPlayerTurn === true) {
          const cellIndex = parseInt(cell.dataset.index, 10);
          if (!cell.classList.contains("bombed")) {
            highlightBomb(cellIndex, enemyCellBlocks, "grey");
          }
        }
      });

      cell.addEventListener("mouseleave", () => {
        if (isPlayerTurn === true) {
          const cellIndex = parseInt(cell.dataset.index, 10);

          if (!cell.classList.contains("bombed")) {
            highlightBomb(cellIndex, enemyCellBlocks, "#272727");
          }
        }
      });

      cell.addEventListener("click", () => {
        if (isPlayerTurn === true && !cell.classList.contains("bombed")) {
          const cellIndex = parseInt(cell.dataset.index, 10);
          placeBomb(cellIndex, enemyCellBlocks, "lightblue");
          isPlayerTurn = false;
          setTimeout(throwEnemyBomb, 1500);
          turnTextElement.innerText = _aiTurnString;
        }
      });
    });
  }
}

function throwEnemyBomb() {
  let cellIndex;
  let cell;
  let lastThrowedBomb;

  do {
    cellIndex = Math.floor(Math.random() * cellBlocks.length);
    cell = cellBlocks[cellIndex];
  } while (cell != null && cell.classList.contains("enemy-bombed"));

  let allThrowedBombs = document.querySelectorAll(".enemy-bombed");

  if (allThrowedBombs != null) {
    for (let i = 0; i < allThrowedBombs.length; i++) {
      if (!allThrowedBombs[i].classList.contains("placed")) {
        allThrowedBombs[i].style.backgroundColor = "lightblue";
        console.log(allThrowedBombs[i]);
      }
    }
  }

  if (cell.classList.contains("placed")) {
    cell.classList.add("enemy-bombed");
    cell.style.backgroundColor = "purple";
  } else {
    cell.classList.add("enemy-bombed");
    cell.style.backgroundColor = "lightblue";
    lastThrowedBomb = cell;
    lastThrowedBomb.style.backgroundColor = "green";
  }

  isPlayerTurn = true;
  turnTextElement.innerText = _playerTurnString;
}
