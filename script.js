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

const next = (currIndex, maxIndex, minIndex = 0) => {
  const newIndex = (currIndex < maxIndex) ? currIndex + 1 : minIndex;
  return newIndex;
};

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

class Field {
  constructor(treasuresAtOneLevel, levelsOfTreasures, maxOxygen, numOfPlayers) {
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

    const players = [];
    for (let i = 0; i < numOfPlayers; i++) {
      players.push(new Player());
    }
    this.players = players;
    this.activeIndex = 0;
    this.activePlayer = this.players[this.activeIndex];
  }

  resetOxygen() {
    this.currentOxygen = this.maxOxygen;
  }

  reduceOxygen(amount) {
    this.currentOxygen -= amount;
  }

  checkOxygen() {
    if (this.currentOxygen <= 0) {
      this.players.filter((player) => !player.isSaved).forEach((player) => {
        player.reset();
        console.dir(`${player} resetted `);
      });
    }
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
      currentIndex = (this.tiles[length - 1].isFree) ? length - 1 : length - 2;
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

  swapPlayer() {
    this.activeIndex = next(this.activeIndex, this.players.length - 1);
    this.activePlayer = this.players[this.activeIndex];
    console.dir('--- SWAP TO ---     Player' + this.activeIndex);
  }
}

const field = new Field(TREASURES_AT_1_LEVEL, LEVELS_OF_TREASURES, MAX_OXYGEN, NUM_OF_PLAYERS);
//now do only js mechanics of game, html & css realisation will be added later

//making skip and take button inactive in css
btnMoveUp.addEventListener('click', () => {
  field.activePlayer.moveUp();
  console.dir('Player' + field.activeIndex + ' is moving up');
});

btnRoll.addEventListener('click', () => {
  const value = rollTwoDices(DICE_VALUES);
  console.dir(value + ' on dices');
  //showing rolled dices on screen
  const dir = field.activePlayer.direction;
  const pos = field.activePlayer.position;
  const num = field.activePlayer.numberOfTreasures();
  field.reduceOxygen(num);
  console.dir(field.currentOxygen + ' oxygen left \n');

  let newPos;
  if (dir === DOWNWARDS) {
    newPos = field.movePlayerDown(pos, value, num);
  } else {
    newPos = field.movePlayerUp(pos, value, num);
  }
  field.activePlayer.changePos(newPos);
  console.dir('new placement of Player' + field.activeIndex + ' is ' + newPos);
  //moving player to new position on screen

  if (field.activePlayer.position === 0) {
    field.activePlayer.save();
    console.dir('Player' + field.activeIndex + ' saved and got ' + field.activePlayer.totalPoints);
    //display totalPoints of activePlayer;
  }
});

btnTake.addEventListener('click', () => {
  const pos = field.activePlayer.position;
  const treasure = field.takeTresure(pos);
  if (treasure > 0) field.activePlayer.addTreasure(treasure);
  //removing treasure from field and giving it to player
  console.dir('Player' + field.activeIndex + ' got a treasure ' + treasure);
  field.checkOxygen();
  field.swapPlayer();
  //blurring old player and making active another
});

btnSkip.addEventListener('click', () => {
  field.checkOxygen();
  field.swapPlayer();
  //blurring old player and making active another
});

