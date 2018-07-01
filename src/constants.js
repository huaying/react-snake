export const NUM_ROW = 20;
export const NUM_COLUMN = 11;

export const LOOP_TIME = 100;

export const EMPTY = 0;
export const SNAKE = 1;
export const FOOD = 2;

export const BLOCK = {
  [EMPTY]: "empty",
  [SNAKE]: "snake",
  [FOOD]: "food"
};

export const GAME_STATUS = {
  INIT: 0,
  PLAYING: 1,
  GAMEOVER: 2
};

export const DIR = {
  DOWN: [1, 0],
  UP: [-1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1]
};
