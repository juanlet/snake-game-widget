class Game {
  constructor() {
    this._canvas = document.getElementById("ctx");
    this._ctx = this._canvas.getContext("2d");
    this._ctx.font = "20px Calibri";
    this._width = 500;
    this._height = 500;
    this._snake = new Snake();
    this._food = new Food(this);
    this.render();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  drawSnake() {
    const ctx = this._ctx;
    const snake = this._snake;
    ctx.save();
    ctx.fillStyle = snake.color;

    snake.body.map(bp => {
      ctx.fillRect(bp.x, bp.y, snake.dimensions[0], snake.dimensions[1]);
    });

    ctx.restore();
  }

  drawFood() {
    const food = this._food;
    const ctx = this._ctx;

    ctx.save();
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(food.x, food.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  render() {
    this.drawSnake();
    this.drawFood();
  }

  get ctx() {
    return this._ctx;
  }

  generateRandomCoordinate() {
    const coordinates = this._canvas.getBoundingClientRect();
    const { top, right, bottom, left } = coordinates;

    const x = Math.floor(Math.random() * right) + left;
    const y = Math.floor(Math.random() * bottom) + top;

    const roundedX =
      Math.floor(x / this._snake.dimensions[0]) * this._snake.dimensions[0];

    const roundedY =
      Math.floor(y / this._snake.dimensions[1]) * this._snake.dimensions[1];

    return [roundedX, roundedY];
  }
}

class Snake {
  constructor() {
    this._body = [
      new SnakeBodyPart(220, 200),
      new SnakeBodyPart(210, 200),
      new SnakeBodyPart(200, 200)
    ];
    this._color = "green";
    this._dimensions = [20, 20];
  }

  //addPart() {}

  get body() {
    return this._body;
  }

  get bodyMeasure() {
    return this._bodyMeasure;
  }

  get color() {
    return this._color;
  }

  get dimensions() {
    return this._dimensions;
  }
}

class SnakeBodyPart {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }
}

class Food {
  constructor(game) {
    this._width = 20;
    this._height = 20;
    this._color = "orange";
    const randomCoordinate = game.generateRandomCoordinate();
    this._x = randomCoordinate[0];

    this._y = randomCoordinate[1];
  }

  set width(width) {
    this._width = width;
  }

  set height(height) {
    this._height = height;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get color() {
    return this._color;
  }
}

const game = new Game();
const ctx = game.ctx;

console.log(ctx);
