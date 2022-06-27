'use strict';

const NUM_OF_PLAYERS = 2;
const LEVELS_OF_TREASURES = [1, 2, 3, 4];
const TREASURES_AT_1_LEVEL = 8;
const RANGE_FOR_EACH_LEVEL = 4;
const DICE_VALUES = [1, 2, 3];
const MAX_OXYGEN = 25;
const EMPTY_TILE = { value: 0, isFree: false };
const SUBMARINE = { value: -1, isFree: true };
const DOWNWARDS = 1;
const UPWARDS = -1;

const submarineEl = document.getElementById('submarine');
const oxygenEl = document.getElementById('oxygen');
const winnerEl = document.getElementById('winner');
const player0El = document.getElementById('player--0');
const player1El = document.getElementById('player--1');
const btnMoveUp = document.getElementById('btn--moveup');
const btnRoll = document.getElementById('btn--roll');
const btnTake = document.getElementById('btn--take');
const btnSkip = document.getElementById('btn--skip');
const dice0El = document.getElementById('dice--0');
const dice1El = document.getElementById('dice--1');

const dup = (value, number) => {
  const arr = new Array(number);
  arr.fill(value);
  return arr.map((value) => ({ ...value }));
};

const rand = (max, min = 0) => {
  const value = Math.floor((max - min) * Math.random() + min);
  return value; // right border does not include
};

const randValueFromTreasure = (levelOfTreasure) => {
  const max = levelOfTreasure * RANGE_FOR_EACH_LEVEL;
  const min = max - RANGE_FOR_EACH_LEVEL;
  return rand(max, min);
};

const next = (currIndex, maxIndex, minIndex = 0) => {
  const newIndex = (currIndex < maxIndex) ? currIndex + 1 : minIndex;
  return newIndex;
};


class HtmlDisplay {
  constructor(levelsOfTreasures, treasuresAtOneLevel) {
    this.levelsOfTreasures = levelsOfTreasures;
    this.treasuresAtOneLevel = treasuresAtOneLevel;
    this.tilesArray = [submarineEl];
  }

  drawField() {
    const gameField = document.getElementById('game--field');
    let tile;
    for (let i = 0; i < LEVELS_OF_TREASURES.length; i++) {
      const lineOfTiles = [];
      for (let j = 0; j < TREASURES_AT_1_LEVEL; j++) {
        tile = document.createElement('div');
        tile.className = `tile level${i + 1}`;
        lineOfTiles.push(tile);
        gameField.appendChild(tile);
      }
      if (i % 2 === 1) lineOfTiles.reverse();
      this.tilesArray.push(...lineOfTiles);
    }
  }

  rollTwoDices(diceValues) {
    const max = diceValues.length;
    const firstDiceValue = diceValues[rand(max)];
    const secondDiceValue = diceValues[rand(max)];
    dice0El.src = `images/dice-${firstDiceValue}.png`;
    dice1El.src = `images/dice-${secondDiceValue}.png`;
    return firstDiceValue + secondDiceValue;
  }

  unclickable(...buttons) {
    for (const button of buttons) {
      button.classList.add('disabled');
    }
  }

  clickable(...buttons) {
    for (const button of buttons) {
      button.classList.remove('disabled');
    }
  }

  updateInfo(element, info) {
    element.textContent = info;
  }

  updateActive() {
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
  }

  updateEmptyTile(index) {
    const curTile = this.tilesArray[index];
    curTile.classList.add('empty');
  }

  moveChip(curPos, newPos, activeIndex) {
    const curTile = this.tilesArray[curPos];
    const newTile = this.tilesArray[newPos];
    if (curPos) {
      curTile.removeChild(curTile.firstChild);
    }
    if (newPos) {
      const tile = document.createElement('div');
      tile.className = `chip chip--${activeIndex}`;
      newTile.appendChild(tile);
    }
  }
}

class Player {
  constructor(position = 0, treasures = []) {
    this.position = position;
    this.treasures = treasures;
    this.direction = DOWNWARDS;
    this.totalScore = 0;
    this.isSaved = false;
  }

  reset() {
    this.position = 0;
    this.treasures = [];
    this.direction = DOWNWARDS;
  }

  changePos(newPos) {
    this.position = newPos;
  }

  save() {
    this.isSaved = true;
    for (const treasure of this.treasures) {
      this.totalScore += randValueFromTreasure(treasure);
    }
    this.treasures = [];
  }

  numberOfTreasures() {
    return this.treasures.length;
  }

  moveUp() {
    this.direction = UPWARDS;
  }

  addTreasure(treasureLevel) {
    this.treasures.push(treasureLevel);
  }

  removeTreasure(treasureLevel) {
    const index = this.treasures.indexOf(treasureLevel);
    treasureLevel.splice(index, 1);
  }

  countValueOfTreasures() {
    this.treasures.forEach((element) => {
      this.totalScore += randValueFromTreasure(element);
    });
    this.treasures = [];
  }
}

class Field {
  constructor(levelsOfTreasures, treasuresAtOneLevel, maxOxygen, numOfPlayers) {
    this.levelsOfTreasures = levelsOfTreasures;
    this.treasuresAtOneLevel = treasuresAtOneLevel;
    this.maxOxygen = maxOxygen;
    this.currentOxygen = maxOxygen;
    this.numOfPlayers = numOfPlayers;
    this.htmlDisplay = new HtmlDisplay(this.levelsOfTreasures,
      this.treasuresAtOneLevel);
  }

  createField() {
    let tiles = [SUBMARINE];
    for (const level of this.levelsOfTreasures) {
      const obj = { value: level, isFree: true };
      const arr = dup(obj, this.treasuresAtOneLevel);
      tiles = tiles.concat(arr);
    }
    this.tiles = tiles;

    this.htmlDisplay.drawField();
  }

  createPlayers() {
    const players = [];
    for (let i = 0; i < this.numOfPlayers; i++) {
      players.push(new Player());
    }
    this.players = players;
    this.activeIndex = 0;
    this.activePlayer = this.players[this.activeIndex];
  }

  resetOxygen() {
    this.currentOxygen = this.maxOxygen;
    this.htmlDisplay.updateInfo(oxygenEl, this.currentOxygen);
  }

  reduceOxygen(amount) {
    this.currentOxygen -= amount;
    this.htmlDisplay.updateInfo(oxygenEl, this.currentOxygen);
  }

  occupyTile(index) {
    this.tiles[index].isFree = false;
  }

  freeUpTile(index) {
    this.tiles[index].isFree = true;
  }

  takeTresure(index) {
    const currentTreasure = this.tiles[index].value;
    this.tiles[index] = { ...EMPTY_TILE };
    return currentTreasure;
  }

  replaceEmptyTile(index, treasure) {
    this.tiles[index].value = treasure;
    this.freeUpTile(index);
  }

  movePlayerDown(startingIndex, number, numberOfTreasures) {
    const length = this.tiles.length;
    this.freeUpTile(startingIndex);
    let stepsRemain = number + numberOfTreasures;
    let currentIndex = startingIndex;

    while (stepsRemain > 0) {
      currentIndex += DOWNWARDS;
      if (currentIndex < length) {
        if (!this.tiles[currentIndex].isFree) {
          stepsRemain++;
        }
        stepsRemain--;
        continue;
      }
      currentIndex = (this.tiles[length - 1].isFree) ? length - 1 : length - 2;
      break;
    }

    this.occupyTile(currentIndex);
    this.htmlDisplay.moveChip(startingIndex, currentIndex, this.activeIndex);
    return currentIndex;
  }

  movePlayerUp(startingIndex, number, numberOfTreasures) {
    this.freeUpTile(startingIndex);
    let stepsRemain = number - numberOfTreasures;
    let currentIndex = startingIndex;

    while (stepsRemain > 0) {
      currentIndex += UPWARDS;
      if (currentIndex >= 0) {
        if (!this.tiles[currentIndex].isFree) {
          stepsRemain++;
        }
        stepsRemain--;
        continue;
      }
      currentIndex = 0;
      break;
    }

    if (currentIndex) {
      this.occupyTile(currentIndex);
    }
    this.htmlDisplay.moveChip(startingIndex, currentIndex, this.activeIndex);
    return currentIndex;
  }

  IfEnd() {
    return (this.currentOxygen <= 0) ||
    (this.players.every((player) => player.isSaved));
  }

  swapPlayer() {
    this.activeIndex = next(this.activeIndex, this.players.length - 1);
    this.activePlayer = this.players[this.activeIndex];
    this.htmlDisplay.updateActive();
  }

  winnerText() {
    if (this.players[0].totalScore > this.players[1].totalScore) {
      return 'The winner is Player 1 (Green)!';
    } else if (this.players[0].totalScore < this.players[1].totalScore) {
      return 'The winner is Player 2 (Red)!';
    } else return 'Tie';
  }
}

const field = new Field(LEVELS_OF_TREASURES,
  TREASURES_AT_1_LEVEL, MAX_OXYGEN, NUM_OF_PLAYERS);

field.createField();
field.createPlayers();

btnMoveUp.addEventListener('click', () => {
  field.activePlayer.moveUp();
  field.htmlDisplay.unclickable(btnMoveUp);
});

btnRoll.addEventListener('click', () => {
  const value = field.htmlDisplay.rollTwoDices(DICE_VALUES);
  const dir = field.activePlayer.direction;
  const curPos = field.activePlayer.position;
  const num = field.activePlayer.numberOfTreasures();

  field.reduceOxygen(num);
  const newPos = (dir === DOWNWARDS) ?
    field.movePlayerDown(curPos, value, num) :
    field.movePlayerUp(curPos, value, num);
  field.activePlayer.changePos(newPos);
  if (field.activePlayer.position === field.tiles.length - 1) {
    field.activePlayer.direction = UPWARDS;
  }

  if (field.activePlayer.position === 0) {
    field.activePlayer.save();
    const totalScoreEl = document
      .getElementById(`total--${field.activeIndex}`);
    field.htmlDisplay.updateInfo(totalScoreEl, field.activePlayer.totalScore);
    field.swapPlayer();
  }

  field.htmlDisplay.unclickable(btnMoveUp, btnRoll);
  if (field.tiles[newPos].value > 0) {
    field.htmlDisplay.clickable(btnTake);
  }
  field.htmlDisplay.clickable(btnSkip);
});

btnTake.addEventListener('click', () => {
  const pos = field.activePlayer.position;
  const treasure = field.takeTresure(pos);
  if (treasure > 0) {
    field.activePlayer.addTreasure(treasure);
    field.htmlDisplay.updateEmptyTile(pos);

  }
  const currTreasuresEl = document
    .getElementById(`treasures--${field.activeIndex}`);
  field.htmlDisplay.updateInfo(currTreasuresEl,
    field.activePlayer.treasures.toString());
  field.swapPlayer();
  if (field.activePlayer.isSaved) {
    field.swapPlayer();
  }

  if (field.activePlayer.direction === DOWNWARDS) {
    field.htmlDisplay.clickable(btnMoveUp);
  }
  field.htmlDisplay.clickable(btnRoll);
  field.htmlDisplay.unclickable(btnTake, btnSkip);
  if (field.IfEnd()) {
    field.htmlDisplay.updateInfo(winnerEl, field.winnerText());
    field.htmlDisplay.unclickable(btnMoveUp, btnRoll, btnSkip, btnTake);
  }
});

btnSkip.addEventListener('click', () => {
  field.swapPlayer();
  if (field.activePlayer.isSaved) {
    field.swapPlayer();
  }

  if (field.activePlayer.direction === DOWNWARDS) {
    field.htmlDisplay.clickable(btnMoveUp);
  }
  field.htmlDisplay.clickable(btnRoll);
  field.htmlDisplay.unclickable(btnTake, btnSkip);

  if (field.IfEnd()) {
    field.htmlDisplay.updateInfo(winnerEl, field.winnerText());
    field.htmlDisplay.unclickable(btnMoveUp, btnRoll, btnSkip, btnTake);
  }
});

