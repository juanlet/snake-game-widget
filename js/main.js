class Game {
  static _canvas = document.getElementById("ctx");
  static _ctx = Game._canvas.getContext("2d");
  static coordinates = Game._canvas.getBoundingClientRect();
  static currentDirection = null;
  constructor() {
    //Game._ctx.font = "20px Calibri";
    this._width = 500;
    this._height = 500;
    this._snake = new Snake();
    this._food = null;
    console.log("snake", this._snake);
    this.setEvents();
    this.render();
  }

  setEvents() {
    document.onkeydown = this.onArrowKeyDown.bind(this);

    setInterval(() => {
      console.log("CHECK", Game.currentDirection);
      if (Game.currentDirection) {
        //avanzar
        this._snake.updateBody(Game.currentDirection);
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
          Game.currentDirection = "L";
          break;
        case 38:
          //up
          Game.currentDirection = "U";

          break;
        case 39:
          //right
          Game.currentDirection = "R";

          break;
        case 40:
          //down
          Game.currentDirection = "B";

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
    this._food = new Food(this);
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

  generateRandomCoordinates() {
    const { top, right, bottom, left } = Game.coordinates;

    const x = Math.floor(Math.random() * (right + 20)) + (left - 20);
    const y = Math.floor(Math.random() * (bottom - 20)) + (top + 20);

    const roundedX = Math.floor(x / 10) * 10;

    const roundedY = Math.floor(y / 10) * 10;

    return [roundedX, roundedY];
  }

  static clearRectangle(x, y) {
    Game.ctx.clearRect(x, y, 20, 20);
  }

  static clearFood(x, y) {
    Game.ctx.beginPath();
    Game.ctx.clearRect(x - 10 - 1, y - 10 - 1, 10 * 2 + 2, 10 * 2 + 2);
    Game.ctx.closePath();
  }

  static convertToInboundCoordinates(x, y) {
    const { top, right, bottom, left } = Game.coordinates;

    const newCoords = [];

    if (x < left) {
      newCoords[0] = right;
    } else if (x > right) {
      newCoords[0] = left;
    } else {
      newCoords[0] = x;
    }

    if (y > bottom) {
      newCoords[1] = top;
    } else if (y < top) {
      newCoords[1] = bottom;
    } else {
      newCoords[1] = y;
    }

    return newCoords;
  }

  detectCollision(x, y) {
    const food = this._food;
    //(x < food.x + 10 ||  x > food.x - 10) && (y < food.y + 10 ||  y > food.y - 10)
    if (
      x > food.x - 25 &&
      x < food.x + 25 &&
      y > food.y - 25 &&
      y < food.y + 25
    ) {
      //add body to snake
      console.log("you ate food");
      this._snake.addBodyPart();
      this.drawSnake();
      Game.clearFood(this._food.x, this._food.y);
      this.drawFood();
    }
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

  addBodyPart(direction) {
    let coords = [];
    let _x = this.body[this.body.length - 1].x;
    let _y = this.body[this.body.length - 1].y;

    switch (direction) {
      case "U":
        coords[0] = _x;
        convertedCoords = Game.convertToInboundCoordinates(
          null,
          _y + this.step
        );
        coords[1] = convertedCoords[1];
        break;

      case "R":
        convertedCoords = Game.convertToInboundCoordinates(
          _y - this.step,
          null
        );
        coords[0] = convertedCoords[0];
        coords[1] = _y;
        break;

      case "B":
        coords[0] = _x;
        convertedCoords = Game.convertToInboundCoordinates(
          null,
          _y - this.step
        );
        coords[1] = convertedCoords[1];
        break;
      case "L":
        convertedCoords = Game.convertToInboundCoordinates(
          _x + this.step,
          null
        );
        coords[0] = convertedCoords[0];
        coords[1] = _y;
        break;
    }

    const newBodyPart = new SnakeBodyPart(coords[0], coords[1]);
    this.body.push(newBodyPart);
  }

  updateBody(direction) {
    const body = this.body;
    let prevCoords = [];
    let convertedCoords;
    for (let i = body.length - 1; i >= 0; i--) {
      game.detectCollision(body[i].x, body[i].y);
      if (i === 0) {
        //direction
        switch (direction) {
          case "U":
            convertedCoords = Game.convertToInboundCoordinates(
              null,
              body[i].y - this.step
            );
            body[i].y = convertedCoords[1];
            break;

          case "R":
            convertedCoords = Game.convertToInboundCoordinates(
              body[i].x + this.step,
              null
            );
            body[i].x = convertedCoords[0];
            break;

          case "B":
            convertedCoords = Game.convertToInboundCoordinates(
              null,
              body[i].y + this.step
            );
            body[i].y = convertedCoords[1];
            break;
          case "L":
            convertedCoords = Game.convertToInboundCoordinates(
              body[i].x - this.step,
              null
            );
            body[i].x = convertedCoords[0];
            break;
        }
        return;
      }
      const nextElem = body[i - 1];
      prevCoords = Game.convertToInboundCoordinates(nextElem.x, nextElem.y);
      Game.clearRectangle(body[i].x, body[i].y);
      body[i].x = prevCoords[0];
      body[i].y = prevCoords[1];
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
    const randomCoordinate = game.generateRandomCoordinates();
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

  set x(x) {
    this._x = x;
  }

  set y(y) {
    this._y = y;
  }

  get color() {
    return this._color;
  }
}

const game = new Game();
