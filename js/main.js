class Game {
  static _canvas = document.getElementById("ctx");
  static _ctx = Game._canvas.getContext("2d");

  constructor() {
    //Game._ctx.font = "20px Calibri";
    this._width = 500;
    this._height = 500;
    this._snake = new Snake();
    this._food = new Food(this);
    this._currentDirection = null;
    console.log("snake", this._snake);
    this.setEvents();
    this.render();
  }

  setEvents() {
    document.onkeydown = this.onArrowKeyDown.bind(this);

    setInterval(() => {
      console.log("CHECK", this._currentDirection);
      if (this._currentDirection) {
        //avanzar
        this._snake.updateBody(this._currentDirection);
        this.drawSnake();
      }
    }, 100);
  }

  onArrowKeyDown(e) {
    const { keyCode } = e;
    console.log("key down", keyCode);
    if ([37, 38, 39, 40].indexOf(keyCode) !== -1) {
      switch (keyCode) {
        case 37:
          //left
          this._currentDirection = "L";
          break;
        case 38:
          //up
          this._currentDirection = "U";

          break;
        case 39:
          //right
          this._currentDirection = "R";

          break;
        case 40:
          //down
          this._currentDirection = "B";

          break;

        default:
          break;
      }
    }
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  drawSnake() {
    const ctx = Game.ctx;
    const snake = this._snake;
    ctx.save();

    snake.body.map((bp, i) => {
      ctx.fillStyle = i === 0 ? "black" : snake.color;

      ctx.fillRect(bp.x, bp.y, snake.dimensions[0], snake.dimensions[1]);
    });

    ctx.restore();
  }

  drawFood() {
    const food = this._food;
    const ctx = Game.ctx;

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

  static get ctx() {
    return Game._ctx;
  }

  generateRandomCoordinate() {
    const coordinates = Game._canvas.getBoundingClientRect();
    const { top, right, bottom, left } = coordinates;

    const x = Math.floor(Math.random() * right) + left;
    const y = Math.floor(Math.random() * bottom) + top;

    const roundedX = Math.floor(x / 10) * 10;

    const roundedY = Math.floor(y / 10) * 10;

    return [roundedX, roundedY];
  }

  static clearRectangle(x, y) {
    Game.ctx.clearRect(x, y, 20, 20);
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
    this.step = 20;
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

  updateBody(direction) {
    const body = this._body;
    let prevCoords = [];
    for (let i = body.length - 1; i >= 0; i--) {
      if (i === 0) {
        //direction
        switch (direction) {
          case "U":
            body[i].y -= this.step;
            break;

          case "R":
            body[i].x += this.step;
            break;

          case "B":
            body[i].y += this.step;
            break;
          case "L":
            body[i].x -= this.step;
            break;
        }
        return;
      }
      const nextElem = body[i - 1];
      prevCoords = [nextElem.x, nextElem.y];
      Game.clearRectangle(body[i].x, body[i].y);
      body[i].x = nextElem.x;
      body[i].y = nextElem.y;
    }
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

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
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
