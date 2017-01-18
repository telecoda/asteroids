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
    Global.TOTAL_LEVELS = 3;
    Global.POINTS_PER_HIT = 5;
    // ship
    Global.SHIP_DRAG = 100;
    Global.SHIP_MAX_VELOCITY = 200;
    Global.MAX_HEALTH = 1000;
    // asteroids
    Global.ASTEROID_MULTIPLIER = 1;
    Global.ASTEROID_DAMAGE = 10;
    Global.MAX_ASTEROID_VELOCITY = 200;
    // weapon
    Global.BULLET_SPEED = 300;
    Global.FIRE_RATE = 100;
    Global.MAX_BULLETS = 30;
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
            _this.state.add("Menu", Asteroids.Menu);
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
    var Asteroid = (function (_super) {
        __extends(Asteroid, _super);
        // -------------------------------------------------------------------------
        function Asteroid(game, x, y, size) {
            var _this = _super.call(this, game, 0, 0, "asteroid-01") || this;
            _this._setSize = function (size) {
                if (size > Asteroid.MAX_SIZE) {
                    size = Asteroid.MAX_SIZE;
                }
                if (size < Asteroid.MIN_SIZE) {
                    size = Asteroid.MIN_SIZE;
                }
                _this._size = size;
                var scale = Asteroid.scales[size - 1];
                // scale asteroid based on size
                _this.scale = new Phaser.Point(scale, scale);
                var cx = (_this.width * scale) / 2;
                var cy = (_this.height * scale) / 2;
                // set body size 25% smaller
                var scaledWidth = _this.width / scale;
                var scaledHeight = _this.height / scale;
                var bodyWidth = scaledWidth * 0.75;
                var bodyHeight = scaledHeight * 0.75;
                // offset body from upper left x,y coord by 1/8th the width (25% / 2)
                _this.body.setSize(bodyWidth, bodyHeight, scaledWidth / 8, scaledHeight / 8);
            };
            _this.hitByBullet = function () {
                // decrease size
                if (_this._size > Asteroid.MIN_SIZE) {
                    _this._setSize(_this._size - 1);
                    // spawn a second asteroid
                    var second = new Asteroid(_this.game, _this.x, _this.y, _this._size);
                    second.setGroup(_this._group);
                    second.addToGroup();
                    second.startMoving();
                    return false;
                }
                else {
                    // destroy it
                    _this.exists = false;
                    return true;
                }
            };
            _this.setGroup = function (group) {
                _this._group = group;
            };
            _this.addToGroup = function () {
                _this._group.add(_this);
            };
            _this.startMoving = function () {
                _this.body.velocity.x = (Asteroids.Global.MAX_ASTEROID_VELOCITY / 2) - (Math.random() * Asteroids.Global.MAX_ASTEROID_VELOCITY);
                _this.body.velocity.y = (Asteroids.Global.MAX_ASTEROID_VELOCITY / 2) - (Math.random() * Asteroids.Global.MAX_ASTEROID_VELOCITY);
            };
            // center player sprite horizontally
            _this.anchor.x = 0.5;
            _this.anchor.y = 0.5;
            //this.loadTexture('asteroid-01');
            // enable physics for asteroid
            game.physics.arcade.enable(_this, false);
            // no gravity
            var body = _this.body;
            body.allowGravity = false;
            body.angularVelocity = -100;
            body.maxVelocity.set(200);
            _this.x = x;
            _this.y = y;
            _this._setSize(size);
            return _this;
        }
        return Asteroid;
    }(Phaser.Sprite));
    Asteroid.scales = [0.10, 0.25, 0.50, 0.75, 1];
    Asteroid.MIN_SIZE = 1;
    Asteroid.MAX_SIZE = 5;
    Asteroids.Asteroid = Asteroid;
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
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            return _super.apply(this, arguments) || this;
        }
        // -------------------------------------------------------------------------
        Menu.prototype.create = function () {
            // init background
            this._background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'stars');
            this._background.anchor.setTo(0.5, 0.5);
            // text 
            var textStyle = { font: "72px Arial", fill: "#ffffff", align: "center" };
            this._startText = this.game.add.text(50, 50, "Press SPACE to start", textStyle);
            this._startText.x = this.game.width / 2 - this._startText.width / 2;
            this._startText.y = this.game.height / 2 - this._startText.height / 2;
            this._startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.update = function () {
            if (this._startKey.isDown) {
                this.game.state.start("Play");
            }
        };
        return Menu;
    }(Phaser.State));
    Asteroids.Menu = Menu;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super.apply(this, arguments) || this;
            _this._asteroidCount = 0;
            _this._bullets = [];
            _this._lives = 0;
            _this._score = 0;
            _this._level = 0;
            _this._startNewGame = function () {
                _this._setStatus("Start level 1");
                _this._state = Play.LEVEL_START;
                _this._lives = Asteroids.Global.TOTAL_LIVES;
                _this._score = 0;
                _this._level = 1;
                _this._startLevel();
            };
            _this._startLevel = function () {
                _this._setStatus("Starting level " + _this._level);
                _this._state = Play.LEVEL_START;
                _this._asteroidCount = _this._level * Asteroids.Global.ASTEROID_MULTIPLIER;
                _this._initAsteroids(_this._asteroidCount);
                //  Wait 2 seconds then start level
                _this.game.time.events.add(Phaser.Timer.SECOND * 2, _this._startPlaying, _this);
            };
            _this._startNextLevel = function () {
                _this._setStatus("");
                if (_this._level < Asteroids.Global.TOTAL_LEVELS) {
                    _this._level++;
                    _this._startLevel();
                }
                else {
                    // game complete!
                    _this._gameCompleted();
                }
            };
            _this._levelCompleted = function () {
                _this._setStatus("Level " + _this._level + " complete");
                _this._state = Play.LEVEL_END;
                //  Wait 2 seconds then start a next level
                _this.game.time.events.add(Phaser.Timer.SECOND * 2, _this._startNextLevel, _this);
            };
            _this._gameCompleted = function () {
                _this._setStatus("Congratulations - Game Complete!");
                _this._state = Play.GAME_COMPLETED;
            };
            _this._gameOver = function () {
                _this._setStatus("Game Over");
                _this._state = Play.GAME_OVER;
            };
            _this._startPlaying = function () {
                _this._hideStatus();
                _this._resetPlayer();
                _this._state = Play.PLAYING;
            };
            _this._resetPlayer = function () {
                _this._spaceship.health = Asteroids.Global.MAX_HEALTH;
                _this._spaceship.body.drag.set(Asteroids.Global.SHIP_DRAG);
                _this._spaceship.body.maxVelocity.set(Asteroids.Global.SHIP_MAX_VELOCITY);
                _this._spaceship.angle = 0;
                _this._spaceship.x = _this.game.world.centerX;
                _this._spaceship.y = _this.game.world.centerY;
            };
            _this._resumePlaying = function () {
                _this._setStatus("Keep going...");
                _this._state = Play.LEVEL_START;
                //  Wait 2 seconds then start level
                _this.game.time.events.add(Phaser.Timer.SECOND * 2, _this._startPlaying, _this);
            };
            _this._playerDied = function () {
                _this._state = Play.PLAYER_DIED;
                _this._lives--;
                if (_this._lives < 1) {
                    _this._gameOver();
                    return;
                }
                _this._resumePlaying();
            };
            _this._setStatus = function (text) {
                _this._statusText.setText(text);
                _this._statusText.x = _this.game.width / 2 - _this._statusText.width / 2;
                _this._statusText.y = _this.game.height / 2 - _this._statusText.height / 2;
                _this._statusText.visible = true;
            };
            _this._hideStatus = function () {
                _this._statusText.visible = false;
            };
            _this._initAsteroids = function (count) {
                _this._asteroids = new Phaser.Group(_this.game);
                for (var i = 0; i < count; i++) {
                    var x = _this.game.width * Math.random();
                    var y = -50;
                    var asteroid = new Asteroids.Asteroid(_this.game, x, y, 5);
                    asteroid.setGroup(_this._asteroids);
                    asteroid.addToGroup();
                    asteroid.startMoving();
                }
            };
            _this._bulletHitAsteroid = function (bullet, asteroid) {
                // we can't kill/destroy the asteroid here as it messes up the underlying array an we'll
                // get undefined errors as we try to reference deleted objects.
                bullet.kill();
                var destroyed = asteroid.hitByBullet();
                if (destroyed) {
                    _this._asteroidCount--;
                }
                else {
                    // increase count as asteroid has split in two
                    _this._asteroidCount++;
                }
                _this._score += Asteroids.Global.POINTS_PER_HIT;
            };
            _this._spaceshipHitAsteroid = function (spaceship, asteroid) {
                spaceship.health -= Asteroids.Global.ASTEROID_DAMAGE;
            };
            return _this;
        }
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
            this._spaceship.health = Asteroids.Global.MAX_HEALTH;
            //  and its physics settings
            this.game.physics.enable(this._spaceship, Phaser.Physics.ARCADE);
            this._weapon = this.game.add.weapon(Asteroids.Global.MAX_BULLETS, 'bullet');
            this._weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            this._weapon.bulletSpeed = Asteroids.Global.BULLET_SPEED;
            this._weapon.fireRate = Asteroids.Global.FIRE_RATE;
            this._weapon.trackSprite(this._spaceship, 0, 0, true);
            // text overlay
            var textStyle = { font: "72px Arial", fill: "#ffffff", align: "center" };
            this._statusText = this.game.add.text(0, 0, "", textStyle);
            // healthbar
            this._healthBar = this.game.add.graphics(0, 0);
            // setup input
            this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this._thrustKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this._pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
            this._startNewGame();
        };
        // -------------------------------------------------------------------------
        Play.prototype.update = function () {
            switch (this._state) {
                case Play.PLAYING: {
                    // check for level complete
                    if (this._asteroidCount == 0) {
                        this._levelCompleted();
                        break;
                    }
                    if (this._spaceship.health <= 0) {
                        this._playerDied();
                    }
                    this._handleInput();
                    this._wrapLocation(this._spaceship);
                    this._asteroids.forEachExists(function (sprite) {
                        this._wrapLocation(sprite);
                    }, this);
                    //  Collision detection
                    this.game.physics.arcade.overlap(this._weapon.bullets, this._asteroids, this._bulletHitAsteroid, null, this);
                    this.game.physics.arcade.overlap(this._spaceship, this._asteroids, this._spaceshipHitAsteroid, null, this);
                    // update health display
                    // health remaining    
                    this._healthBar.clear();
                    this._healthBar.beginFill(0x00ff00);
                    this._healthBar.drawRect(0, 0, this._spaceship.health, 20);
                    this._healthBar.beginFill(0xff0000);
                    this._healthBar.drawRect(this._spaceship.health, 0, this.game.width, 20);
                    break;
                }
            }
        };
        Play.prototype.render = function () {
            this.game.debug.text("fps:" + this.game.time.fps.toString(), 2, 14, "#ffffff");
            this.game.debug.text("Score:" + this._score, 100, 14, "#ffffff");
            this.game.debug.text("Health:" + this._spaceship.health, 200, 14, "#ffffff");
            this.game.debug.text("Lives:" + this._lives, 300, 14, "#ffffff");
            this.game.debug.text("Level:" + this._level, 400, 14, "#ffffff");
            this.game.debug.text("Left:" + this._asteroidCount, 500, 14, "#ffffff");
            this._weapon.debug();
            // this._asteroids.forEachExists(function (sprite: Phaser.Sprite) {
            //     this.game.debug.body(sprite);
            // }, this);
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
        Play.prototype._wrapLocation = function (sprite) {
            // check if ship offscreen , wrap around
            var sx = sprite.x;
            var sy = sprite.y;
            var width = sprite.width / 2;
            var height = sprite.height / 2;
            if (sx + width < 0) {
                // off to left
                sprite.x = Asteroids.Global.GAME_WIDTH + width;
            }
            else if (sx - width > Asteroids.Global.GAME_WIDTH) {
                // off to right
                sprite.x = -width;
            }
            if (sy + height < 0) {
                // off to the top
                sprite.y = Asteroids.Global.GAME_HEIGHT + height;
            }
            else if (sy - height > Asteroids.Global.GAME_HEIGHT) {
                // off to the bottom
                sprite.y = -height;
            }
        };
        return Play;
    }(Phaser.State));
    Play.LEVEL_START = 1;
    Play.PLAYING = 2;
    Play.LEVEL_END = 3;
    Play.PLAYER_DIED = 4;
    Play.GAME_OVER = 5;
    Play.GAME_COMPLETED = 6;
    Play.PAUSED = 7;
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
                this.game.state.start("Menu");
            }
        };
        return Preload;
    }(Phaser.State));
    Asteroids.Preload = Preload;
})(Asteroids || (Asteroids = {}));
//# sourceMappingURL=game.js.map