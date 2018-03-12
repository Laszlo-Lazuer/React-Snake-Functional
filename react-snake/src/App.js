import React, { Component } from 'react';
import './App.css';
import cs from 'classnames';

const TICK_RATE = 100;
const GRID_SIZE = 35;
const GRID = [];
const KEY_CODES_MAPPER = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'BOTTOM',
};

const getRandomFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getRandomCoordinate = () =>
  ({
    x: getRandomFromRange(1, GRID_SIZE - 1),
    y: getRandomFromRange(1, GRID_SIZE - 1),
  });

for (let i=0; i <= GRID_SIZE; i++) {
  GRID.push(i);
}

const DIRECTIONS = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  BOTTOM: 'BOTTOM',
};

const DIRECTION_TICKS = {
  UP: (x,y) => ({ x, y: y - 1 }),
  BOTTOM: (x,y) => ({ x, y: y + 1 }),
  RIGHT: (x,y) => ({ x: x + 1, y: y}),
  LEFT: (x,y) => ({ x: x -1, y: y}),
};

const isBorder = (x,y) =>
  x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE;

const isPosition = (x, y, diffX, diffY) =>
  x === diffX && y === diffY;

const isSnake = (x,y, snakeCoordinates) =>
  snakeCoordinates.filter(c => isPosition(c.x, c.y, x, y)).length;

const getSnakeHead = (snake) =>
  snake.coordinates[0];

const getSnakeWithoutStub = (snake) =>
  snake.coordinates.slice(0, snake.coordinates.length - 1);

const getIsSnakeEating = ({ snake, snack }) =>
  isPosition(getSnakeHead(snake).x, getSnakeHead(snake).y, snack.coordinate.x, snack.coordinate.y);

const getCellCS = (snake, snack, x,y) =>
  cs('grid-cell', {
    'grid-cell-border': isBorder(x,y),
    'grid-cell-snake': isSnake(x,y, snake.coordinates),
    'grid-cell-snack': isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
  });

  const doChangeDIrection = (direction) => () => ({
    playground: {
      direction
    }
  });

  const applySnakePosition = prevState => {
    const isSnakeEating = getIsSnakeEating(prevState);

    const snakeHead = DIRECTION_TICKS[prevState.playground.direction](
      getSnakeHead(prevState.snake).x,
      getSnakeHead(prevState.snake).y,
    );

    const snakeTail = isSnakeEating
      ? prevState.snake.coordinates
      : getSnakeWithoutStub(prevState.snake);

    const snackCoordinate = isSnakeEating
      ? getRandomCoordinate()
      : prevState.snack.coordinate;

    return {
      snake: {
        coordinates: [snakeHead, ...snakeTail],
      },
      snack: {
        coordinate: snackCoordinate,
      },
    };
  };

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
        direction: DIRECTIONS.RIGHT,
      },
      snake: {
        coordinates: [getRandomCoordinate()],
      },
      snack: {
        coordinate: getRandomCoordinate(),
      }
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.onTick, TICK_RATE);

    window.addEventListener('keyup', this.onChangeDirection, true);
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    window.removeEventListener('keyup', this.onChangeDirection, false);
  }

  onTick = () => {
    //Move snake
    this.setState(applySnakePosition);
  }

  onChangeDirection = (event) => {
    const direction = KEY_CODES_MAPPER[event.keyCode];
    if (direction) {
        this.setState(doChangeDIrection(direction));
    }
  }

  render() {
    const {
      snake,
      snack,
    } = this.state;
    return (
      <div className="app">
      <h1>Snake!</h1>
      <Grid
        snake={snake}
        snack={snack}
        />
      </div>
    );
  }
}

const Grid = ({snake, snack}) =>
<div>
  {GRID.map(y =>
    <Row
      y={y}
      key={y}
      snake={snake}
      snack={snack}
      />
  )}
</div>

const Row = ({ snake, snack, y }) =>
  <div className="grid-row">
    {GRID.map(x =>
      <Cell
        x={x}
        y={y}
        key={x}
        snake={snake}
        snack={snack}
      />
    )}
  </div>

  const Cell = ({ snake, snack, x,y }) =>
    <div className={getCellCS(snake, snack, x,y)} />


export default App;
