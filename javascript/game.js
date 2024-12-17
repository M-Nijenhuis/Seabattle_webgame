// This is the variable that stores the player board
const playerBoard = document.getElementById("player-board");

//This is the function that create all the block in the playerfield
function CreateBoard(board) {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

CreateBoard(playerBoard);

//This are all the cell in the player field
const cellBlocks = document.querySelectorAll(".cell");

//All boats you have in the game
let boats = [2, 3, 3, 4, 5];
let currentBoatSize = boats[0];
let isHorizontal = true;
let boatIsChoosed = false;
let currentHoveredCell = null;

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (isHorizontal === true) {
    highlightCells(currentHoveredCell, currentBoatSize, "#222");
    isHorizontal = false;
    highlightCells(currentHoveredCell, currentBoatSize, "grey");
  } else {
    highlightCells(currentHoveredCell, currentBoatSize, "#222");
    isHorizontal = true;
    highlightCells(currentHoveredCell, currentBoatSize, "grey");
  }
});

function setCurrentBoat(boatId) {
  const pressedButton = (document.getElementById(boatId).disabled = true);
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
}

function resetBoats() {
  cellBlocks.forEach((cell) => {
    if (cell.classList.contains("placed")) {
      cell.classList.remove("placed");
      cell.style.backgroundColor = "#222";
    }
  });

  for (i = 0; i <= 5; i++) {
    let button = (document.getElementById(`chooseBoat${i}`).disabled = false);
    console.log(button);
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
    if (!cell.classList.contains("placed")) {
      highlightCells(cellIndex, currentBoatSize, "#222");
    }
  });

  cell.addEventListener("click", () => {
    if (boatIsChoosed === true) {
      const cellIndex = parseInt(cell.dataset.index, 10);
      if (canPlaceBoat(cellIndex, currentBoatSize)) {
        placeBoat(cellIndex, currentBoatSize);
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

function canPlaceBoat(startIndex, size) {
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
    }
  }
  return true;
}

//This function just maked the clicked block a red background color
let boatNumber = 1;

function placeBoat(startIndex, size) {
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
  boatNumber++;
  boatIsChoosed = false;
}
