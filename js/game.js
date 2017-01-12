var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Asteroids;
(function (Asteroids) {
    var Global = (function () {
        function Global() {
        }
        return Global;
    }());
    // game size
    Global.GAME_WIDTH = 1024;
    Global.GAME_HEIGHT = 800;
    // constants
    Global.TOTAL_LIVES = 3;
    Asteroids.Global = Global;
})(Asteroids || (Asteroids = {}));
// -------------------------------------------------------------------------
window.onload = function () {
    Asteroids.Global.game = new Asteroids.Game();
};
/// <reference path="../tsDefinitions/phaser.d.ts" />
var Asteroids;
(function (Asteroids) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = 
            // init game
            _super.call(this, Asteroids.Global.GAME_WIDTH, Asteroids.Global.GAME_HEIGHT, Phaser.AUTO, "content") || this;
            // states
            _this.state.add("Boot", Asteroids.Boot);
            _this.state.add("Preload", Asteroids.Preload);
            _this.state.add("Play", Asteroids.Play);
            // start
            _this.state.start("Boot");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    Asteroids.Game = Game;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super.apply(this, arguments) || this;
        }
        // -------------------------------------------------------------------------
        Boot.prototype.create = function () {
            this.game.state.start("Preload");
        };
        return Boot;
    }(Phaser.State));
    Asteroids.Boot = Boot;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super.apply(this, arguments) || this;
            _this._asteroidCount = 0;
            _this._bullets = [];
            // status
            _this._gameOver = false;
            _this._lives = 0;
            _this._score = 0;
            _this._level = 0;
            _this._initAsteroids = function (count) {
                _this._asteroids = new Phaser.Group(_this.game);
                for (var i = 0; i < count; i++) {
                    var asteroid = _this.game.add.sprite(_this.game.world.centerX - 200, _this.game.world.centerY - 200 + i * 50, 'asteroid-01');
                    asteroid.anchor.setTo(0.5, 0.5);
                    _this.game.physics.enable(asteroid, Phaser.Physics.ARCADE);
                    // create bounding box smaller that whole asteroid
                    asteroid.body.setSize(asteroid.width - 50, asteroid.height - 50, 25, 25);
                    _this._asteroids.add(asteroid);
                }
            };
            _this._bulletHitAsteroid = function (asteroid, bullet) {
                asteroid.destroy();
                bullet.kill();
                _this._asteroidCount--;
            };
            return _this;
        }
        Play.prototype.render = function () {
            this.game.debug.text("fps:" + this.game.time.fps.toString(), 2, 14, "#ffffff");
            this.game.debug.text("Score:" + this._score, 100, 14, "#ffffff");
            this.game.debug.text("Lives:" + this._lives, 200, 14, "#ffffff");
            this.game.debug.text("Level:" + this._level, 300, 14, "#ffffff");
            this.game.debug.text("Left:" + this._asteroidCount, 400, 14, "#ffffff");
            this._weapon.debug();
            this._asteroids.forEachExists(function (sprite) {
                this.game.debug.body(sprite);
            }, this);
        };
        // -------------------------------------------------------------------------
        Play.prototype.create = function () {
            // enable fps
            this.game.time.advancedTiming = true;
            // enable physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // init background
            this._background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'stars');
            this._background.anchor.setTo(0.5, 0.5);
            // init spaceship
            this._spaceship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spaceship');
            this._spaceship.anchor.setTo(0.5, 0.5);
            this._spaceship.angle = 0;
            this._spaceship.scale = new Phaser.Point(0.5, 0.5);
            //  and its physics settings
            this.game.physics.enable(this._spaceship, Phaser.Physics.ARCADE);
            this._spaceship.body.drag.set(100);
            this._spaceship.body.maxVelocity.set(200);
            this._weapon = this.game.add.weapon(30, 'bullet');
            this._weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            this._weapon.bulletSpeed = 300;
            this._weapon.fireRate = 100;
            this._weapon.trackSprite(this._spaceship, 0, 0, true);
            // setup input
            this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this._thrustKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this._startGame();
            this._initAsteroids(this._asteroidCount);
        };
        // -------------------------------------------------------------------------
        Play.prototype.update = function () {
            this._handleInput();
            this._wrapShipLocation();
            //  Collision detection
            this.game.physics.arcade.overlap(this._weapon.bullets, this._asteroids, this._bulletHitAsteroid, null, this);
        };
        Play.prototype._startGame = function () {
            this._lives = Asteroids.Global.TOTAL_LIVES;
            this._score = 0;
            this._level = 1;
            this._asteroidCount = 5;
        };
        Play.prototype._handleInput = function () {
            if (this._thrustKey.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this._spaceship.rotation, 200, this._spaceship.body.acceleration);
            }
            else {
                this._spaceship.body.acceleration.set(0);
            }
            if (this._leftKey.isDown) {
                this._spaceship.body.angularVelocity = -300;
            }
            else if (this._rightKey.isDown) {
                this._spaceship.body.angularVelocity = 300;
            }
            else {
                this._spaceship.body.angularVelocity = 0;
            }
            if (this._fireKey.isDown) {
                this._weapon.fire();
            }
        };
        Play.prototype._wrapShipLocation = function () {
            // check if ship offscreen , wrap around
            var sx = this._spaceship.x;
            var sy = this._spaceship.y;
            var width = this._spaceship.width / 2;
            var height = this._spaceship.height / 2;
            if (sx + width < 0) {
                // off to left
                this._spaceship.x = Asteroids.Global.GAME_WIDTH + width;
            }
            else if (sx - width > Asteroids.Global.GAME_WIDTH) {
                // off to right
                this._spaceship.x = -width;
            }
            if (sy + height < 0) {
                // off to the top
                this._spaceship.y = Asteroids.Global.GAME_HEIGHT + height;
            }
            else if (sy - height > Asteroids.Global.GAME_HEIGHT) {
                // off to the bottom
                this._spaceship.y = -height;
            }
        };
        return Play;
    }(Phaser.State));
    Asteroids.Play = Play;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            var _this = _super.apply(this, arguments) || this;
            // music decoded, ready for game
            _this._ready = false;
            return _this;
        }
        // -------------------------------------------------------------------------
        Preload.prototype.preload = function () {
            this.load.image("stars", "assets/stars.png");
            this.load.image("asteroid-01", "assets/asteroid-01.png");
            this.load.image("spaceship", "assets/spaceship.png");
            this.load.image("bullet", "assets/bullet.png");
        };
        // -------------------------------------------------------------------------
        Preload.prototype.create = function () {
        };
        // -------------------------------------------------------------------------
        Preload.prototype.update = function () {
            // run only once
            if (this._ready === false) {
                this._ready = true;
                this.game.state.start("Play");
            }
        };
        return Preload;
    }(Phaser.State));
    Asteroids.Preload = Preload;
})(Asteroids || (Asteroids = {}));
//# sourceMappingURL=game.js.map