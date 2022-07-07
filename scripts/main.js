'use strict';

import { NUM_OF_PLAYERS, LEVELS_OF_TREASURES, TREASURES_AT_1_LEVEL,
   DICE_VALUES, MAX_OXYGEN, DOWNWARDS, UPWARDS, winnerEl, btnMoveUp, 
   btnRoll, btnSkip, btnTake } from './gamestate.js';

import { Field } from './classes.js';

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