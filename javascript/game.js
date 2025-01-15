// This is the variable that stores the player board
const playerBoard = document.getElementById("player-board");
const startButtonContainer = document.querySelector(".startButtonContainer");

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

//All boats you have in the game
let boats = [2, 3, 3, 4, 5];
let enemyBoats = [2, 3, 3, 4, 5];
let currentBoatSize = boats[0];
let isHorizontal = true;
let boatIsChoosed = false;
let currentHoveredCell = null;
let boatNumber = 0;
let gameIsStarted = false;

let placedBoats = 0;

//This code rotates the boat with a specific button press
document.addEventListener("keydown", (event) => {
  if (event.key === "r" && isHorizontal === true && !gameIsStarted) {
    highlightCells(currentHoveredCell, currentBoatSize, "#222");
    isHorizontal = false;
    highlightCells(currentHoveredCell, currentBoatSize, "grey");
  } else {
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

  console.log(boatIndex);
  currentBoatSize = boats[boatIndex];
  boatIsChoosed = true;

  boatNumber = newBoatNumber;
  console.log(newBoatNumber, boatNumber);

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
          console.log("Alle boten zijn geplaatst!");
        }
      } else {
        console.log("Kan de boot hier niet plaatsen!");
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
    cell.style.backgroundColor = color;
    cell.classList.add("bombed");
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
  console.log("Placed boats:" + placedBoats);

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
  console.log("Placed boats:" + placedBoats);
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

    console.log(enemyBoats[boatIndex]);

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

    console.log(
      `The canplaceboat option is ${canPlaceBoat(randomStartIndex, boatSize, randomDirectionBool, enemyCellBlocks)}`,
    );
    console.log(enemyCellBlocks[randomStartIndex]);
    console.log(`isHorizontal is ${randomDirectionBool}`);

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
}

function enableBombThrowing() {
  console.log("Hello");
  const enemyCellBlocks = document.querySelectorAll(".enemy-cell");
  console.log(enemyCellBlocks);

  enemyCellBlocks.forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      const cellIndex = parseInt(cell.dataset.index, 10);
      if (!cell.classList.contains("bombed")) {
        highlightBomb(cellIndex, enemyCellBlocks, "grey");
      }
    });

    cell.addEventListener("mouseleave", () => {
      const cellIndex = parseInt(cell.dataset.index, 10);

      if (!cell.classList.contains("bombed")) {
        highlightBomb(cellIndex, enemyCellBlocks, "#272727");
      }
    });

    cell.addEventListener("click", () => {
      const cellIndex = parseInt(cell.dataset.index, 10);
      placeBomb(cellIndex, enemyCellBlocks, "lightblue");
    });
  });
}
