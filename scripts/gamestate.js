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

export {NUM_OF_PLAYERS, LEVELS_OF_TREASURES, TREASURES_AT_1_LEVEL, RANGE_FOR_EACH_LEVEL, 
  DICE_VALUES, MAX_OXYGEN, EMPTY_TILE,SUBMARINE, DOWNWARDS, UPWARDS, submarineEl,oxygenEl,
  winnerEl, player0El, player1El ,btnMoveUp, btnRoll, btnSkip, btnTake, dice0El, dice1El, 
  dup, rand, randValueFromTreasure, next};