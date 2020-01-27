class Game {
  static _canvas = document.getElementById("ctx");
  static _ctx = Game._canvas.getContext("2d");
  static coordinates = Game._canvas.getBoundingClientRect();
  static currentDirection = null;
  static keys = {
    37: "L",
    38: "U",
    39: "R",
    40: "B"
  };

  constructor() {
    //Game._ctx.font = "20px Calibri";
    this._width = 500;
    this._height = 500;
    this._snake = new Snake();
    this._food = null;
    this._score = 0;
    this.setEvents();
    this.render();
  }

  static get ctx() {
    return Game._ctx;
  }

  setEvents() {
    //check for multiple keys pressed as well
    document.onkeydown = this.onArrowKeyDown.bind(this);
    setInterval(() => {
      if (Game.currentDirection) {
        this._snake.updateBody(Game.currentDirection);
        this.drawSnake();
      }
    }, 50);
  }
  //renders everything on the canvas
  render() {
    this.drawSnake();
    this.drawFood();
  }

  onArrowKeyDown(e) {
    const { keyCode } = e;

    if (
      Game.keys[keyCode] &&
      this.isSnakeHeadInBounds() &&
      !this.pressedOppositeDirection(keyCode)
    ) {
      Game.currentDirection = Game.keys[keyCode];
    }
  }
  //draws the snake on screen
  drawSnake() {
    const ctx = Game.ctx;
    const snake = this._snake;
    ctx.save();

    snake.body.map((bp, i) => {
      ctx.fillStyle = i === 0 ? "#9b59b6" : snake.color;

      ctx.fillRect(bp.x, bp.y, snake.dimensions[0], snake.dimensions[1]);
    });

    ctx.restore();
  }
  //draws the food on screen
  drawFood() {
    this._food = new Food(this);
    const food = this._food;
    const ctx = Game.ctx;
    console.log("Drawing food", food.x, food.y);
    ctx.save();
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(food.x, food.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  //checks if user has pressed the opposite direction of the current one
  pressedOppositeDirection(keyCode) {
    return (Game.currentDirection === "U" && Game.keys[keyCode] === "B") ||
      (Game.currentDirection === "B" && Game.keys[keyCode] === "U") ||
      (Game.currentDirection === "L" && Game.keys[keyCode] === "R") ||
      (Game.currentDirection === "R" && Game.keys[keyCode] === "L")
      ? true
      : false;
  }
  //generates a random coordinate within the bounds of the canvas
  generateRandomCoordinates() {
    const { top, right, bottom, left } = Game.coordinates;

    const x = Math.floor(Math.random() * 480 + 20);
    const y = Math.floor(Math.random() * 480 + 20);
    return [x, y];
  }

  //checks if snake is still on the canvas
  isSnakeHeadInBounds() {
    const { x, y } = this._snake.body[0];
    const { top, right, bottom, left } = Game.coordinates;

    return x >= right || x <= left || y <= top || y >= bottom ? false : true;
  }
  //clear a body part of the snake from screen
  static clearSnakeBodyPart(x, y) {
    Game.ctx.clearRect(x, y, 20, 20);
  }
  //clears food from screen
  static clearFood(x, y) {
    Game.ctx.beginPath();
    Game.ctx.clearRect(x - 10 - 1, y - 10 - 1, 10 * 2 + 2, 10 * 2 + 2);
    Game.ctx.closePath();
  }

  //converts out of bounds coordinates into an inbound coordinate on the opposite side
  static convertToInboundCoordinates(x, y) {
    const { top, right, bottom, left } = Game.coordinates;

    const newCoords = [];
    const drawingOffset = 0;

    if (x < left) {
      newCoords[0] = right - drawingOffset;
    } else if (x > right) {
      newCoords[0] = left + drawingOffset;
    } else {
      newCoords[0] = x;
    }

    if (y > bottom) {
      newCoords[1] = top - drawingOffset;
    } else if (y < top) {
      newCoords[1] = bottom + drawingOffset;
    } else {
      newCoords[1] = y;
    }

    return newCoords;
  }
  //detects a collision between two points. Eg: Between the snake's head and the food
  detectCollision(x, y) {
    const food = this._food;
    const collisionRange = 25;
    if (
      x > food.x - collisionRange &&
      x < food.x + collisionRange &&
      y > food.y - collisionRange &&
      y < food.y + collisionRange
    ) {
      //add body to snake
      console.log("Found food. Point earned!");
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
    this._color = "#27ae60";
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
  //adds a bodypart to the snake
  addBodyPart() {
    let coords = [];
    let _x = this.body[this.body.length - 1].x;
    let _y = this.body[this.body.length - 1].y;
    let convertedCoords = [];

    switch (Game.currentDirection) {
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
  //updates the body parts position to redraw them later and to make the snake move forward
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
      Game.clearSnakeBodyPart(body[i].x, body[i].y);
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
    this._radius = 10;
    this._color = "#f1c40f";
    const randomCoordinate = game.generateRandomCoordinates();
    this._x = randomCoordinate[0];

    this._y = randomCoordinate[1];
  }

  get radius(radius) {
    return this._radius;
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
