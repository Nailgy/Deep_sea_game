'use strict';

const LEVELS_OF_TREASURES = [1, 2, 3, 4];
const TREASURES_AT_1_LEVEL = 8;
const RANGE_FOR_EACH_LEVEL = 4;
const DICE_VALUES = [1, 2, 3];
const MAX_OXYGEN = 25;
const EMPTY_TILE = { value: 0, isFree: false };
const SUBMARINE = { value: -1, isFree: true };
const DOWNWARDS = 1;
const UPWARDS = -1;
const btnMoveUp = document.querySelector('.btn--moveup');
const btnRoll = document.querySelector('.btn--roll');
const btnTake = document.querySelector('.btn--take');
const btnSkip = document.querySelector('.btn--skip');

const dup = (value, number) => {
  const arr = new Array(number);
  arr.fill(value);
  return arr.map((value) => ({ ...value }));
};

const rand = (max, min = 0) => {
  const value = Math.floor((max - min) * Math.random() + min);
  return value; // right border does not include
};

const rollTwoDices = (diceValues) => {
  const max = diceValues.length;
  const firstDiceIndex = rand(max);
  const secondDiceIndex = rand(max);
  return diceValues[firstDiceIndex] + diceValues[secondDiceIndex];
};

const randValueFromTreasure = (levelOfTreasure) => {
  const max = levelOfTreasure * RANGE_FOR_EACH_LEVEL;
  const min = max - RANGE_FOR_EACH_LEVEL;
  return rand(max, min);
};

const switchPlayer = (activePlayerIndex) => {
  const newIndex = (activePlayerIndex === 0) ? 1 : 0;
  return newIndex;
};

class Field {
  constructor(treasuresAtOneLevel, levelsOfTreasures, maxOxygen) {
    this.treasuresAtOneLevel = treasuresAtOneLevel;
    this.levelsOfTreasures = levelsOfTreasures;
    this.maxOxygen = maxOxygen;
    this.currentOxygen = maxOxygen;

    let tiles = [SUBMARINE];
    for (const level of this.levelsOfTreasures) {
      const obj = { value: level, isFree: true };
      const arr = dup(obj, this.treasuresAtOneLevel);
      tiles = tiles.concat(arr);
    }
    this.tiles = tiles;
  }

  resetOxygen() {
    this.currentOxygen = this.maxOxygen;
  }

  reduceOxygen(amount) {
    this.currentOxygen -= amount;
  }

  isOxygenLeft() {
    return this.currentOxygen > 0;
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
        if (!this.tiles[currentIndex].isFree) currentIndex += DOWNWARDS;
        stepsRemain--;
        continue;
      }
      if (this.tiles[length - 1].isFree) currentIndex = length - 1;
      else currentIndex = length - 2;
      break;
    }

    this.occupyTile(currentIndex);
    return currentIndex;
  }

  movePlayerUp(startingIndex, number, numberOfTreasures) {
    this.freeUpTile(startingIndex);
    let stepsRemain = number - numberOfTreasures;
    let currentIndex = startingIndex;

    while (stepsRemain > 0) {
      currentIndex += UPWARDS;
      if (currentIndex >= 0) {
        if (!this.tiles[currentIndex].isFree) currentIndex += UPWARDS;
        stepsRemain--;
        continue;
      }
      currentIndex = 0;
      break;
    }

    if (currentIndex) this.occupyTile(currentIndex);
    return currentIndex;
  }
}

class Player {
  constructor(position = 0, treasures = []) {
    this.position = position;
    this.treasures = treasures;
    this.direction = DOWNWARDS;
    this.totalPoints = 0;
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
      this.totalPoints += randValueFromTreasure(treasure);
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
      this.totalPoints += randValueFromTreasure(element);
    });
    this.treasures = [];
  }
}

const field = new Field(TREASURES_AT_1_LEVEL, LEVELS_OF_TREASURES, MAX_OXYGEN);
const player0 = new Player();
const player1 = new Player();
const players = [player0, player1];
let activePlayerIndex = 0;
let activePlayer = players[activePlayerIndex];
//now do only js mechanics of game, html & css realisation will be added later

//making skip and take button inactive in css
btnMoveUp.addEventListener('click', () => {
  activePlayer.moveUp();
});

btnRoll.addEventListener('click', () => {
  const value = rollTwoDices(DICE_VALUES);
  console.dir(value + ' on dices');
  //showing rolled dices on screen
  const dir = activePlayer.direction;
  const pos = activePlayer.position;
  const num = activePlayer.numberOfTreasures();
  field.reduceOxygen(num);
  console.dir(field.currentOxygen + ' oxygen');
  if (dir === DOWNWARDS) {
    const newPos = field.movePlayerDown(pos, value, num);
    activePlayer.changePos(newPos);
    console.dir('new placement of ' + activePlayerIndex + ' is ' + newPos);
    //moving player to new position on screen
  } else {
    const newPos = field.movePlayerUp(pos, value, num);
    activePlayer.changePos(newPos);
    console.dir('new placement of ' + activePlayerIndex + ' is ' + newPos);
    //moving player to new position on screen
  }
  if (activePlayer.position === 0) {
    activePlayer.save();
    console.dir('player ' + activePlayerIndex + ' saved and got ' + activePlayer.totalPoints);
    //display totalPoints of activePlayer;
  }
});

btnTake.addEventListener('click', () => {
  const pos = activePlayer.position;
  const treasure = field.takeTresure(pos);
  if (treasure > 0) activePlayer.addTreasure(treasure);
  //removing treasure from field and giving it to player
  console.dir(activePlayerIndex + 'got a treasure ' + treasure);
  if (!field.isOxygenLeft()) {
    players.filter((player) => !player.isAboard()).forEach((player) => {
      player.reset();
      console.dir(`${player} resetted `);
    });
  }
  activePlayerIndex = switchPlayer(activePlayerIndex);
  activePlayer = players[activePlayerIndex];
  console.dir('--- SWAP TO --- ' + activePlayerIndex);
  //blurring old player and making active another
});

btnSkip.addEventListener('click', () => {
  if (!field.isOxygenLeft()) {
    players.filter((player) => !player.isAboard).forEach((player) => {
      player.reset;
      console.dir(`${player} resetted `);
    });
  }
  activePlayerIndex = switchPlayer(activePlayerIndex);
  activePlayer = players[activePlayerIndex];
  console.dir('--- SWAP TO --- ' + activePlayerIndex);
  //blurring old player and making active another
});

