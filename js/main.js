class Game {
  static dimensions = {
    width: 500,
    height: 500
  };
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
  static snake = null;
  static food = null;
  static score = 0;
  static interval = null;

  constructor() {
    Game.snake = new Snake();
    this.setEvents();
    this.render();
  }

  static get ctx() {
    return Game._ctx;
  }

  setEvents() {
    //check for multiple keys pressed as well
    document.onkeydown = this.onArrowKeyDown.bind(this);
    this.interval = setInterval(() => {
      const collideSelf = this.collideWithSelf();
      console.log("COLLIDE", collideSelf);
      if (collideSelf) {
        clearInterval(this.interval);
        console.log("You lost");
        return;
      }
      if (Game.currentDirection) {
        Game.snake.updateBody(Game.currentDirection);
        this.drawSnake();
      }
    }, 100);
  }
  //renders everything on the canvas
  render() {
    this.drawFood();
    this.drawSnake();
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
    const snake = Game.snake;
    const food = Game.food;
    ctx.save();

    snake.body.map((bp, i) => {
      ctx.fillStyle = i === 0 ? "#9b59b6" : snake.color;
      ctx.fillRect(bp.x, bp.y, snake.body[i].width, snake.body[i].height);
    });

    let doCollideWithFood = Game.detectCollision(
      { x: snake.body[0].x, y: snake.body[0].y },
      food,
      30
    );

    let doCollideWithSelf = Game.detectCollision(
      { x: snake.body[0].x, y: snake.body[0].y },
      food,
      30
    );

    if (doCollideWithFood) {
      console.log("Found food. Point earned!");
      snake.updateBody(Game.currentDirection);
      Game.clearFood(food.x, food.y);
      snake.addBodyPart();

      this.drawFood();
    }

    ctx.restore();
  }
  //draws the food on screen
  drawFood() {
    Game.food = new Food(this);
    const food = Game.food;
    const ctx = Game.ctx;
    ctx.save();
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.radius, 0, 2 * Math.PI);
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
  generateRandomCoordinates(distanceToWalls = 0) {
    const { top, right, bottom, left } = Game.coordinates;

    const x = Game.getRandomInt(0, 500 - distanceToWalls);
    const y = Game.getRandomInt(0, 500 - distanceToWalls);
    return [x, y];
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //checks if snake is still on the canvas
  isSnakeHeadInBounds() {
    const { x, y } = Game.snake.body[0];
    const { top, right, bottom, left } = Game.coordinates;

    return x >= right || x <= left || y <= top || y >= bottom ? false : true;
  }
  //clear a body part of the snake from screen
  static clearSnakeBodyPart(bodyPart) {
    Game.ctx.clearRect(bodyPart.x, bodyPart.y, bodyPart.width, bodyPart.height);
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
  //detects a collision between two points. Eg: Between the snake's head and the food, between the snake head and body
  static detectCollision(firstObject, secondObject, collisionRange) {
    if (
      firstObject &&
      secondObject &&
      firstObject.x > secondObject.x - collisionRange &&
      firstObject.x < secondObject.x + collisionRange &&
      firstObject.y > secondObject.y - collisionRange &&
      firstObject.y < secondObject.y + collisionRange
    ) {
      return true;
    }

    return false;
  }

  collideWithSelf() {
    const head = Game.snake.body[0];
    const body = Game.snake.body.slice(1);

    return body.some(bp => {
      Game.detectCollision(head, bp, 10);
    });
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
    this.dim = this._body[0].height;
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

  //adds a bodypart to the snake
  addBodyPart() {
    let coords = [];
    let _x = this.body[this.body.length - 1].x;
    let _y = this.body[this.body.length - 1].y;
    let convertedCoords = [];

    switch (Game.currentDirection) {
      case "U":
        coords[0] = _x;
        convertedCoords = Game.convertToInboundCoordinates(null, _y + this.dim);
        coords[1] = convertedCoords[1];
        break;

      case "R":
        convertedCoords = Game.convertToInboundCoordinates(_y - this.dim, null);
        coords[0] = convertedCoords[0];
        coords[1] = _y;
        break;

      case "B":
        coords[0] = _x;
        convertedCoords = Game.convertToInboundCoordinates(null, _y - this.dim);
        coords[1] = convertedCoords[1];
        break;
      case "L":
        convertedCoords = Game.convertToInboundCoordinates(_x + this.dim, null);
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
      if (i === 0) {
        //direction
        switch (direction) {
          case "U":
            convertedCoords = Game.convertToInboundCoordinates(
              null,
              body[i].y - this.dim
            );
            body[i].y = convertedCoords[1];
            break;

          case "R":
            convertedCoords = Game.convertToInboundCoordinates(
              body[i].x + this.dim,
              null
            );
            body[i].x = convertedCoords[0];
            break;

          case "B":
            convertedCoords = Game.convertToInboundCoordinates(
              null,
              body[i].y + this.dim
            );
            body[i].y = convertedCoords[1];
            break;
          case "L":
            convertedCoords = Game.convertToInboundCoordinates(
              body[i].x - this.dim,
              null
            );
            body[i].x = convertedCoords[0];
            break;
        }
        return;
      }
      const nextElem = body[i - 1];
      prevCoords = Game.convertToInboundCoordinates(nextElem.x, nextElem.y);
      Game.clearSnakeBodyPart(body[i]);
      body[i].x = prevCoords[0];
      body[i].y = prevCoords[1];
    }
  }
}

class SnakeBodyPart {
  constructor(x, y, width = 15, height = 15) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
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

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this._height = height;
  }
}

class Food {
  constructor(game) {
    this._radius = 4;
    this._color = "#f1c40f";
    const randomCoordinate = game.generateRandomCoordinates(100);
    this._x = randomCoordinate[0];

    this._y = randomCoordinate[1];
  }

  get radius() {
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
