class Game {
  constructor() {
    this._canvas = document.getElementById("ctx");
    this._ctx = this._canvas.getContext("2d");
    this._ctx.font = "20px Calibri";
    this._width = 500;
    this._height = 500;
  }

  get ctx() {
    return this._ctx;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

class Snake {
  constructor() {
    this._snakeBody = [new SnakeBodyPart(20, 20)];
  }

  get bodyWidth() {
    return this._bodyWidth;
  }

  get bodyHeight() {
    return this._bodyHeight;
  }
}

class SnakeBodyPart {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
}

class Food {
  constructor() {
    this._width = 20;
    this._height = 20;
  }

  set width(width) {
    this._width = width;
  }

  set height(height) {
    this._height = height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

const game = new Game();
const ctx = game.ctx;

console.log(ctx);
