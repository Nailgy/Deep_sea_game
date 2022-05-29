'use strict';

const LEVELS_OF_TREASURES = [1, 2, 3, 4];
const TREASURES_AT_ONE_LEVEL = 8;
const RANGE_FOR_EACH_LEVEL = 4;
const DICE_VALUES = [1, 2, 3];
const MAX_OXYGEN = 25;
const EMPTY_TILE = { value: 0, isFree: false };
const SUBMARINE = { value: 'submarine', isFree: true, playersAboard: [] };
const DOWNWARDS = 1;
const UPWARDS = -1;

const dup = (value, number) => {
  const arr = new Array(number);
  arr.fill(value);
  return arr;
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

const switchPlayer = (activePlayer) => {
  const newActivePlayer = (activePlayer === 0) ? 1 : 0;
  return newActivePlayer;
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
    this.tiles[index] = EMPTY_TILE;
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
      if (!this.tiles[currentIndex].isFree) currentIndex += DOWNWARDS;

      if (currentIndex < length) {
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
      if (!this.tiles[currentIndex].isFree) {
        currentIndex += UPWARDS;
      }
      stepsRemain--;
    }
    currentIndex = Math.max(currentIndex, 0);
    return currentIndex;
  }
}

class Player {
  constructor(position = 0, treasures = []) {
    this.position = position;
    this.treasures = treasures;
    this.direction = DOWNWARDS;
    this.totalPoints = 0;
  }

  reset() {
    this.position = 0;
    this.treasures = [];
    this.direction = DOWNWARDS;
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

const main = () => {
  const field = new Field(TREASURES_AT_ONE_LEVEL, LEVELS_OF_TREASURES, MAX_OXYGEN);
  const player0 = new Player();
  const player1 = new Player();
  const players = [player0, player1];
  let activePlayer = 0;

};


