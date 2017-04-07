var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (point) {
        this.x += point.x;
        this.y += point.y;
    };
    return Point;
}());
var Vector = (function (_super) {
    __extends(Vector, _super);
    function Vector() {
        _super.apply(this, arguments);
    }
    Vector.prototype.flipX = function () {
        this.x *= -1;
    };
    Vector.prototype.flipY = function () {
        this.y *= -1;
    };
    return Vector;
}(Point));
var Rect = (function () {
    function Rect(left, top, right, bottom) {
        this.topLeft = new Point(left, top);
        this.bottomRight = new Point(right, bottom);
    }
    Rect.prototype.clone = function () {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
    };
    Rect.prototype.add = function (point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    };
    Rect.prototype.moveTo = function (rect) {
        this.topLeft.x = rect.topLeft.x;
        this.topLeft.y = rect.topLeft.y;
        this.bottomRight.x = rect.bottomRight.x;
        this.bottomRight.y = rect.bottomRight.y;
    };
    Rect.prototype.moveCenterXTo = function (centerX) {
        var left = centerX - this.width() / 2;
        var right = left + this.width();
        this.topLeft.x = left;
        this.bottomRight.x = right;
    };
    Rect.prototype.moveBottomTo = function (bottom) {
        var top = bottom - this.height();
        this.topLeft.y = top;
        this.bottomRight.y = bottom;
    };
    Rect.prototype.width = function () {
        return this.bottomRight.x - this.topLeft.x;
    };
    Rect.prototype.height = function () {
        return this.bottomRight.y - this.topLeft.y;
    };
    Rect.prototype.centerX = function () {
        return (this.topLeft.x + this.bottomRight.x) / 2;
    };
    Rect.prototype.centerY = function () {
        return (this.topLeft.y + this.bottomRight.y) / 2;
    };
    Rect.prototype.moveLeft = function (step) {
        this.topLeft.x -= step;
        this.bottomRight.x -= step;
    };
    Rect.prototype.moveRight = function (step) {
        this.topLeft.x += step;
        this.bottomRight.x += step;
    };
    return Rect;
}());
var Side;
(function (Side) {
    Side[Side["None"] = 0] = "None";
    Side[Side["Left"] = 1] = "Left";
    Side[Side["Top"] = 2] = "Top";
    Side[Side["Right"] = 3] = "Right";
    Side[Side["Bottom"] = 4] = "Bottom";
})(Side || (Side = {}));
var Obstacle = (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle() {
        _super.apply(this, arguments);
    }
    Obstacle.prototype.checkCollision = function (antoherRect) {
        var w = 0.5 * (this.width() + antoherRect.width());
        var h = 0.5 * (this.height() + antoherRect.height());
        var dx = this.centerX() - antoherRect.centerX();
        var dy = this.centerY() - antoherRect.centerY();
        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
            var wy = w * dy;
            var hx = h * dx;
            if (wy > hx) {
                return wy > -hx ? Side.Top : Side.Left;
            }
            else {
                return wy > -hx ? Side.Right : Side.Bottom;
            }
        }
        else {
            return Side.None;
        }
    };
    return Obstacle;
}(Rect));
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(sprite, left, top, right, bottom) {
        bottom = bottom || sprite.offsetTop + sprite.offsetHeight;
        right = right || sprite.offsetLeft + sprite.offsetWidth;
        top = top || sprite.offsetTop;
        left = left || sprite.offsetLeft;
        _super.call(this, left, top, right, bottom);
        this.sprite = sprite;
        this.isVisible = true;
    }
    Sprite.prototype.moveTo = function (rect) {
        _super.prototype.moveTo.call(this, rect);
        var _a = this.topLeft, posX = _a.x, posY = _a.y;
        this.sprite.style.left = posX + 'px';
        this.sprite.style.top = posY + 'px';
    };
    Sprite.prototype.hide = function () {
        this.sprite.style.display = 'none';
        this.isVisible = false;
    };
    Sprite.prototype.show = function () {
        this.sprite.style.display = 'block';
        this.isVisible = true;
    };
    Sprite.prototype.checkCollision = function (anotherRect) {
        if (!this.isVisible) {
            return Side.None;
        }
        return _super.prototype.checkCollision.call(this, anotherRect);
    };
    return Sprite;
}(Obstacle));
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(sprite, dir) {
        var radius = parseInt(getComputedStyle(sprite)['border-top-left-radius']);
        _super.call(this, sprite, sprite.offsetLeft, sprite.offsetTop, sprite.offsetLeft + 2 * radius, sprite.offsetTop + 2 * radius);
        this.sprite = sprite;
        this.radius = radius;
        this.velocity = 5;
        this.dir = dir;
    }
    Ball.prototype.calculateNewPosition = function () {
        var newPosition = this.clone();
        newPosition.add(this.dir);
        return newPosition;
    };
    Ball.prototype.bounceHorizontal = function () {
        this.dir.flipY();
    };
    Ball.prototype.bounceVertical = function () {
        this.dir.flipX();
    };
    Ball.prototype.bounceWithAngle = function (angle) {
        angle = angle * (Math.PI / 180);
        this.dir.x = Math.cos(angle) * this.velocity;
        this.dir.y = -Math.sin(angle) * this.velocity;
    };
    return Ball;
}(Sprite));
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle(sprite, maxRight) {
        _super.call(this, sprite);
        this.maxRight = maxRight;
    }
    Paddle.prototype.moveLeft = function (step) {
        var newPosition = this.clone();
        newPosition.moveLeft(step);
        if (newPosition.topLeft.x >= 0) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.moveRight = function (step) {
        var newPosition = this.clone();
        newPosition.moveRight(step);
        if (newPosition.bottomRight.x <= this.maxRight) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.calculateHitAngle = function (ballX, ballRadius) {
        var hitSpot = ballX - this.topLeft.x;
        var maxPaddle = this.width() + ballRadius;
        var minPaddle = -ballRadius;
        var paddleRange = maxPaddle - minPaddle;
        var minAngle = 160;
        var maxAngle = 20;
        var angleRange = maxAngle - minAngle;
        return ((hitSpot * angleRange) / paddleRange) + minAngle;
    };
    return Paddle;
}(Sprite));
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick() {
        _super.apply(this, arguments);
        this.hit = 1;
    }
    Brick.prototype.wasHit = function () {
        return --this.hit < 1;
    };
    return Brick;
}(Sprite));
var hardBrick = (function (_super) {
    __extends(hardBrick, _super);
    function hardBrick() {
        _super.apply(this, arguments);
    }
    return hardBrick;
}(Brick));
var GameState;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["GameOver"] = 1] = "GameOver";
})(GameState || (GameState = {}));
var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["LEFT"] = 37] = "LEFT";
    KeyCodes[KeyCodes["RIGHT"] = 39] = "RIGHT";
})(KeyCodes || (KeyCodes = {}));
var Game = (function () {
    function Game(ballElement, paddle, bricks, boardElement, livesLabel, scoreLabel, newGameBtn) {
        var _this = this;
        this.livesLabel = livesLabel;
        this.scoreLabel = scoreLabel;
        this.newGameBtn = newGameBtn;
        this.loopInterval = 20;
        this.bricks = [];
        this.hardBricks = [];
        this.keyMap = {};
        this.gameState = GameState.Running;
        this.paddle = new Paddle(paddle, boardElement.offsetWidth);
        this.ball = new Ball(ballElement, new Vector(3, -3));
        this.HardBrickRandom(bricks, 'hard', 10);
        this.HardBrickRandom(bricks, 'infinity', 10);
        for (var i = 0; i < bricks.length; i++) {
            if (bricks[i].classList.contains('hard-brick')) {
                this.bricks.push(new Brick(bricks[i]));
            }
            else {
                bricks[i].classList.add("brick_one");
            }
            this.bricks.push(new Brick(bricks[i]));
        }
        this.createWalls(this.ball.radius, boardElement.offsetWidth, boardElement.offsetHeight);
        this.newGame();
        this.newGameBtn.addEventListener('click', function () { return _this.newGame(); });
    }
    Game.prototype.HardBrickRandom = function (bricks, typeBrick, count) {
        var Newbricks = [];
        while (Newbricks.length < count) {
            var random = Math.ceil(Math.random() * (bricks.length - 1));
            if (Newbricks.indexOf(random) === -1) {
                Newbricks.push(random);
            }
        }
        Newbricks.forEach(function (element) {
            bricks[element].classList.add(typeBrick + "-brick");
        });
    };
    Game.prototype.newGame = function () {
        this.livesLeft = 3;
        this.livesLabel.innerText = '' + this.livesLeft;
        this.score = 0;
        this.newGameBtn.style.display = 'none';
        this.ball.show();
        this.gameState = GameState.Running;
        this.ball.bounceWithAngle(60);
        var ballPosition = this.ball.clone();
        ballPosition.moveCenterXTo(this.paddle.centerX());
        ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
        this.ball.moveTo(ballPosition);
    };
    Game.prototype.lostLive = function () {
        if (--this.livesLeft) {
            this.ball.bounceWithAngle(60);
            var ballPosition = this.ball.clone();
            ballPosition.moveCenterXTo(this.paddle.centerX());
            ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
            this.ball.moveTo(ballPosition);
        }
        else {
            this.gameState = GameState.GameOver;
            this.ball.hide();
            this.newGameBtn.style.display = 'block';
        }
        this.livesLabel.innerText = '' + this.livesLeft;
    };
    Game.prototype.createWalls = function (radius, maxX, maxY) {
        this.wallLeft = new Obstacle(-radius, -radius, 0, maxY + radius);
        this.wallTop = new Obstacle(-radius, -radius, maxX + radius, 0);
        this.wallRight = new Obstacle(maxX, -radius, maxX + radius, maxY + radius);
        this.wallBottom = new Obstacle(-radius, maxY, maxX + radius, maxY + radius);
    };
    Game.prototype.run = function () {
        var _this = this;
        document.addEventListener('keyup', function (e) { return _this.keyMap[e.keyCode] = false; });
        document.addEventListener('keydown', function (e) { return _this.keyMap[e.keyCode] = true; });
        setInterval(function () {
            if (_this.gameState !== GameState.Running) {
                return;
            }
            var newBallPosition = _this.ball.calculateNewPosition();
            if (_this.keyMap[KeyCodes.LEFT]) {
                _this.paddle.moveLeft(5);
            }
            else if (_this.keyMap[KeyCodes.RIGHT]) {
                _this.paddle.moveRight(5);
            }
            if (_this.wallBottom.checkCollision(newBallPosition)) {
                _this.lostLive();
                return;
            }
            if (_this.wallLeft.checkCollision(newBallPosition) || _this.wallRight.checkCollision(newBallPosition)) {
                _this.ball.bounceVertical();
            }
            if (_this.wallTop.checkCollision(newBallPosition) || _this.wallBottom.checkCollision(newBallPosition)) {
                _this.ball.bounceHorizontal();
            }
            for (var _i = 0, _a = _this.bricks; _i < _a.length; _i++) {
                var brick = _a[_i];
                var wasHit = false;
                switch (brick.checkCollision(newBallPosition)) {
                    case (Side.Left):
                    case (Side.Right):
                        _this.ball.bounceVertical();
                        wasHit = true;
                        break;
                    case (Side.Top):
                    case (Side.Bottom):
                        _this.ball.bounceHorizontal();
                        wasHit = true;
                }
                if (wasHit) {
                    if (brick.sprite.classList.contains("hit-once")) {
                        brick.hide();
                    }
                    if (brick.sprite.classList.contains("infinity-brick")) {
                        break;
                    }
                    if (brick.sprite.classList.contains("hard-brick")) {
                        brick.sprite.classList.add("hit-once");
                    }
                    if (brick.sprite.classList.contains("brick_one")) {
                        brick.hide();
                    }
                    _this.score += 20;
                    _this.scoreLabel.innerText = '' + _this.score;
                    break;
                }
            }
            if (_this.paddle.checkCollision(newBallPosition)) {
                _this.ball.bounceWithAngle(_this.paddle.calculateHitAngle(_this.ball.centerX(), _this.ball.radius));
            }
            _this.ball.moveTo(_this.ball.calculateNewPosition());
        }, this.loopInterval);
    };
    return Game;
}());
var game = new Game(document.getElementsByClassName("ball")[0], document.getElementsByClassName("paddle")[0], document.getElementsByClassName("brick"), document.getElementsByClassName("game-board")[0], document.getElementById("lives"), document.getElementById("score"), document.getElementById("newGame"));
game.run();
//# sourceMappingURL=application.js.map