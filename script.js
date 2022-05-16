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
