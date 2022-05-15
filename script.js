'use strict';

const LEVELS_OF_TREASURES = [1, 2, 3, 4];
const TREASURES_AT_ONE_LEVEL = 8;
const RANGE_FOR_EACH_LEVEL = 4;
const DICE_VALUES = [1, 2, 3];
const MAX_OXYGEN = 25;
const EMPTY_TILE = {value: 0, isFree: false};
const SUBMARINE = {value: 'submarine', isFree: true, playersAboard: []};
const DOWNWARDS = 1;
const UPWARDS = -1;