import React from "react";

import Board from "./board";
// import { randomItems } from "./utils";

import {
  NUM_ROW,
  NUM_COLUMN,
  EMPTY,
  SNAKE,
  FOOD,
  LOOP_TIME,
  GAME_STATUS,
  DIR
} from "./constants";

export default class Game extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.initState(),
      status: GAME_STATUS.INIT
    };
    window.addEventListener("keydown", this.controller);
  }

  initState() {
    this.snakeDir = DIR.UP;
    this.snake = [[NUM_ROW - 1, Math.floor((NUM_COLUMN - 1) / 2)]];
    this.emptySpots = Array(NUM_COLUMN * NUM_ROW)
      .fill(null)
      .map((e, idx) => [Math.floor(idx / NUM_COLUMN), idx % NUM_COLUMN]);
    this.food = this.generateFood();

    return {
      grid: this.newGrid()
    };
  }

  newGrid = () => {
    const snakeSet = new Set(this.snake.map(pos => pos.toString()));
    const strfoodPos = this.food.toString();
    const grid = [];
    for (let i = 0; i < NUM_ROW; i++) {
      const row = [];
      for (let j = 0; j < NUM_COLUMN; j++) {
        const strIJ = [i, j].toString();
        if (snakeSet.has(strIJ)) {
          row.push(SNAKE);
        } else if (strfoodPos === strIJ) {
          row.push(FOOD);
        } else {
          row.push(EMPTY);
        }
      }
      grid.push(row);
    }
    return grid;
  };

  updateEmptySpots = () => {
    const snakeSet = new Set(this.snake.map(pos => pos.toString()));
    this.emptySpots = this.emptySpots.filter(
      pos => !snakeSet.has(pos.toString())
    );
  };

  gameStart = () => {
    const initState =
      this.state.status !== GAME_STATUS.INIT ? this.initState() : {};
    this.setState(
      {
        initState,
        status: GAME_STATUS.PLAYING
      },
      this.resetTimer
    );
  };

  resetTimer = () => {
    window.clearInterval(this.timer);
    this.timer = setInterval(this.gameLoop, LOOP_TIME);
  };

  gameEnd = () => {
    this.setState({ status: GAME_STATUS.GAMEOVER });
    window.clearInterval(this.timer);
  };

  controller = e => {
    if (this.state.status !== GAME_STATUS.PLAYING) return;

    const DIRMap = {
      37: DIR.LEFT,
      38: DIR.UP,
      39: DIR.RIGHT,
      40: DIR.DOWN
    };

    if (DIRMap[e.keyCode]) this.changeDirection(DIRMap[e.keyCode]);
  };

  changeDirection = dir => {
    if (this.snake.length > 1) {
      const head = this.snake[this.snake.length - 1];
      const pre = this.snake[this.snake.length - 2];
      if ([head[0] + dir[0], head[1] + dir[1]].toString() === pre.toString()) {
        return;
      }
    }
    this.snakeDir = dir;
  };

  gameLoop = () => {
    const { snake, snakeDir } = this;
    const next = this.getNextPos(snake, snakeDir);
    if (next === null) {
      this.gameEnd();
    } else if (this.food.toString() === next.toString()) {
      this.snake.push(next);
      this.updateEmptySpots();
      this.food = this.generateFood();
      this.setState({ grid: this.newGrid() });
    } else {
      this.snake = [...snake.slice(1), next];
      this.setState({ grid: this.newGrid() });
    }
  };

  getNextPos = (snake, snakeDir) => {
    const head = snake[snake.length - 1];
    const [i, j] = [head[0] + snakeDir[0], head[1] + snakeDir[1]];
    const inBoard = i >= 0 && i < NUM_ROW && j >= 0 && j < NUM_COLUMN;

    const isBody =
      snake.length > 1 &&
      snake.some(
        (pos, idx) => idx !== 0 && pos.toString() === [i, j].toString()
      );

    return inBoard && !isBody ? [i, j] : null;
  };

  generateFood = () => {
    const idx = Math.floor(Math.random() * this.emptySpots.length);
    const food = this.emptySpots[idx];
    this.emptySpots = [
      ...this.emptySpots.slice(0, idx),
      ...this.emptySpots.slice(idx)
    ];
    return food;
  };

  render() {
    return (
      <div className="game">
        <Board grid={this.state.grid} gameStatus={this.state.status} />
        <div className="info">
          <span className="title"> Snake </span>
          <span className="start" onClick={this.gameStart}>
            Start
          </span>
        </div>
      </div>
    );
  }
}
