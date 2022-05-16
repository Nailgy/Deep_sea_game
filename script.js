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

class Field {
  constructor(treasuresAtOneLevel, levelsOfTreasures, maxOxygen) {
    this.treasuresAtOneLevel = treasuresAtOneLevel;
    this.levelsOfTreasures = levelsOfTreasures;
    this.maxOxygen = maxOxygen;
    this.currentOxygen = maxOxygen;

    const tiles = [];
    tiles[0] = SUBMARINE;
    for(const level of this.levelsOfTreasures) {
      const obj = { value: level, isFree: true };
      pushMultipleTimes(obj, this.treasuresAtOneLevel, tiles);
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
    const currentTreasure = tiles[index].value;
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
      if(!this.tiles[currentIndex].isFree) {
        currentIndex += DOWNWARDS;
      }
      if(currentIndex < length) {
        stepsRemain--;
      }
      else {
        if(this.tiles[length - 1].isFree) currentIndex = length - 1;
        else currentIndex = length - 2;
        break;
      }
    }
    this.occupyTile(currentIndex);
    return currentIndex;
  }

  movePlayerUp(startingIndex, number, numberOfTreasures) {
    const length = this.tiles.length;
    this.freeUpTile(startingIndex);
    let stepsRemain = number - numberOfTreasures;
    let currentIndex = startingIndex;

    while (stepsRemain > 0) {
      currentIndex += UPWARDS;
      if(!this.tiles[currentIndex].isFree) {
        currentIndex += UPWARDS;
      }
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
}

const pushMultipleTimes = (element, numberOfTimes, arr) => {
  for(let i = 0; i < numberOfTimes; i++) {
    arr.push(element);
  }
}

const randNumFromRange = (max, min = 0) => Math.floor((max - min) * Math.random() + min) // right border does not include

const rollTwoDices = (diceValues) => {
  const max = diceValues.length;
  const firstDiceIndex = randNumFromRange(max); 
  const secondDiceIndex = randNumFromRange(max)
  return diceValues[firstDiceIndex] + diceValues[secondDiceIndex];
}
