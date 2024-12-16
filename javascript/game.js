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

document.addEventListener("keydown", (event) => {
  if (event.key === "z" && isHorizontal === true) {
    isHorizontal = false;
  } else {
    isHorizontal = true;
  }
});

function setCurrentBoat(boat) {

  const match = boat.match(/\d+/);
  let boatIndex;

  if(match) {
    boatIndex = parseInt(match[0], 10);
  } else {
    throw new Error("Geen getal");
  }


  console.log(boat);
  currentBoatSize = boats[boatIndex];
  boatIsChoosed = true;
}

//This code loops true all the cellBlock and add an eventlistener with click and if clicked it fires the PlaceBlock funtion
cellBlocks.forEach((cell) => {

  cell.addEventListener("mouseenter", () => {

    if (boatIsChoosed === true) {
      const cellIndex = parseInt(cell.dataset.index, 10);
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
    const cellIndex = parseInt(cell.dataset.index, 10);
    if (canPlaceBoat(cellIndex, currentBoatSize)) {
      placeBoat(cellIndex, currentBoatSize);
      boats.shift(); // Verwijder de geplaatste boot
      currentBoatSize = boats[0]; // Update naar de volgende boot
      if (!currentBoatSize) {
        console.log("Alle boten zijn geplaatst!");
      }
    } else {
      console.log("Kan de boot hier niet plaatsen!");
    }
  });
});

//This hight
function highlightCells(startIndex, size, color) {
  for (let i = 0; i < size; i++) {
    const cell = cellBlocks[startIndex + (isHorizontal ? i : i * 10)];
    if (cell && !cell.classList.contains("placed")) {
      cell.style.backgroundColor = color;
    }
  }
}

function canPlaceBoat(startIndex, size) {
  for (let i = 0; i < size; i++) {
    const cell = cellBlocks[startIndex + (isHorizontal ? i : i * 10)];
    if (!cell || cell.classList.contains("placed")) {
      return false; // Niet mogelijk om te plaatsen
    }
  }
  return true;
}

//This function just maked the clicked block a grey background color
let boatNumber = 1;

function placeBoat(startIndex, size) {
  for (let i = 0; i < size; i++) {
    const cell = cellBlocks[startIndex + (isHorizontal ? i : i * 10)];
    if (cell) {
      cell.classList.add("placed");
      cell.classList.add(`boat-${boatNumber}`);
      cell.style.backgroundColor = "red";
    }
  }
  boatNumber++;
  boatIsChoosed = false;
}
