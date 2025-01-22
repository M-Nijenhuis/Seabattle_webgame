// This is the variable that stores the player board
const playerBoard = document.getElementById("player-board");
const startButtonContainer = document.querySelector(".startButtonContainer");
const turnTextElement = document.querySelector("#turn-text");

//All buttons for choose boats
const _boat1ReplaceButton = document.querySelector("#replaceBoat0");
const _boat2ReplaceButton = document.querySelector("#replaceBoat1");
const _boat3ReplaceButton = document.querySelector("#replaceBoat2");
const _boat4ReplaceButton = document.querySelector("#replaceBoat3");
const _boat5ReplaceButton = document.querySelector("#replaceBoat4");

//Add a mouseover event to all buttons
_boat1ReplaceButton.addEventListener("mouseover", () => {
  makeBoatDarker(0, "darkred");
});
_boat2ReplaceButton.addEventListener("mouseover", () => {
  makeBoatDarker(1, "darkred");
});
_boat3ReplaceButton.addEventListener("mouseover", () => {
  makeBoatDarker(2, "darkred");
});
_boat4ReplaceButton.addEventListener("mouseover", () => {
  makeBoatDarker(3, "darkred");
});
_boat5ReplaceButton.addEventListener("mouseover", () => {
  makeBoatDarker(4, "darkred");
});

_boat1ReplaceButton.addEventListener("mouseleave", () => {
  makeBoatDarker(0, "red");
});
_boat2ReplaceButton.addEventListener("mouseleave", () => {
  makeBoatDarker(1, "red");
});
_boat3ReplaceButton.addEventListener("mouseleave", () => {
  makeBoatDarker(2, "red");
});
_boat4ReplaceButton.addEventListener("mouseleave", () => {
  makeBoatDarker(3, "red");
});
_boat5ReplaceButton.addEventListener("mouseleave", () => {
  makeBoatDarker(4, "red");
});

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
let lastThrowedBomb;

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

    for (let i = 0; i <= 5; i++) {
      if (cell.classList.contains(`boat-${i}`)) {
        cell.classList.remove(`boat-${i}`);
      }
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

function makeBoatDarker(boatIndex, color) {
  cellBlocks.forEach((cell) => {
    if (cell.classList.contains(`boat-${boatIndex}`)) {
      cell.style.backgroundColor = color;
    }
  });
}

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

let nearbyCells = [];
let currentBoat = null;
let currentBoatCells = [];

function throwEnemyBomb() {
  let cellIndex;
  let randomIndex;
  let cell;
  let differentBoatHit = false;
  let lastHitBoatIndex;

  console.log("This is the lastthrowedbomb", lastThrowedBomb);
  console.log("This is the currentBoatCells", currentBoatCells);

  do {
    try {
      if (currentBoatCells.length > 0) {
        cellIndex = currentBoatCells[0];
        cell = cellBlocks[cellIndex];
        nearbyCells = [];

        console.log("There need a current boat to be hit");
      } else if (nearbyCells.length > 0) {
        randomIndex = Math.floor(Math.random() * nearbyCells.length);
        cellIndex = nearbyCells[randomIndex];
        cell = cellBlocks[cellIndex];
        console.log("The near cell is" + cell);
      } else if (
        lastThrowedBomb &&
        lastThrowedBomb.classList.contains("placed")
      ) {
        console.log("Er is een bom geraakt en we gaan zoeken voor een buurman");

        const lastBombCellIndex = parseInt(lastThrowedBomb.dataset.index, 10);
        console.log(lastBombCellIndex);

        const _top = lastBombCellIndex - 10;
        const _bottom = lastBombCellIndex + 10;
        const _left = lastBombCellIndex - 1;
        const _right = lastBombCellIndex + 1;

        const _topCell = cellBlocks[_top];
        const _bottomCell = cellBlocks[_bottom];
        const _leftCell = cellBlocks[_left];
        const _rightCell = cellBlocks[_right];

        if (_top >= 0 && !_topCell.classList.contains("enemy-bombed"))
          nearbyCells.push(_top);
        if (_bottom < 100 && !_bottomCell.classList.contains("enemy-bombed"))
          nearbyCells.push(_bottom);
        if (
          _left >= 0 &&
          lastBombCellIndex % 10 !== 0 &&
          !_leftCell.classList.contains("enemy-bombed")
        )
          nearbyCells.push(_left);
        if (
          _right < 100 &&
          lastBombCellIndex % 10 !== 9 &&
          !_rightCell.classList.contains("enemy-bombed")
        )
          nearbyCells.push(_right);

        console.log(nearbyCells);
        if (nearbyCells.length > 0) {
          randomIndex = Math.floor(Math.random() * nearbyCells.length);
          cellIndex = nearbyCells[randomIndex];
          cell = cellBlocks[cellIndex];
          console.log("The near cell is" + cell);
        }
      } else {
        cellIndex = Math.floor(Math.random() * cellBlocks.length);
        cell = cellBlocks[cellIndex];
        lastThrowedBomb = cell;
      }

      if (cell == null) {
        console.log("There is no cell");
        cellIndex = Math.floor(Math.random() * cellBlocks.length);
        cell = cellBlocks[cellIndex];
      }
    } catch (error) {
      console.log(error);
      cellIndex = Math.floor(Math.random() * cellBlocks.length);
      cell = cellBlocks[cellIndex];
    }
  } while (cell != null && cell.classList.contains("enemy-bombed"));

  if (currentBoatCells.length > 0) {
    currentBoatCells.splice(0, 1);
  }

  lastThrowedBomb = cell;
  let allThrowedBombs = document.querySelectorAll(".enemy-bombed");

  if (allThrowedBombs != null) {
    for (let i = 0; i < allThrowedBombs.length; i++) {
      if (!allThrowedBombs[i].classList.contains("placed")) {
        allThrowedBombs[i].style.backgroundColor = "lightblue";
      }
    }
  }

  if (cell.classList.contains("placed")) {
    cell.classList.add("enemy-bombed");
    cell.style.backgroundColor = "purple";
    lastThrowedBomb = cell;

    // Zoek naar de 'boat-?' class
    const boatClass = Array.from(cell.classList).find((cls) =>
      /^boat-[0-4]$/.test(cls),
    );

    console.log(boatClass);

    if (boatClass) {
      cellBlocks.forEach((cell) => {
        if (
          cell.classList.contains(boatClass) &&
          !cell.classList.contains("enemy-bombed")
        ) {
          currentBoatCells.push(cell);
        }
      });
    } else {
      console.log("Geen boot gevonden op deze cel.");
    }

    lastHitBoatIndex = boatClass;
  } else {
    cell.classList.add("enemy-bombed");
    cell.style.backgroundColor = "lightblue";
    lastThrowedBomb = cell;
    lastThrowedBomb.style.backgroundColor = "green";
  }

  isPlayerTurn = true;
  turnTextElement.innerText = _playerTurnString;

  if (nearbyCells.length > 0) {
    nearbyCells.splice(randomIndex, 1);
    console.log(nearbyCells);
  }
}
