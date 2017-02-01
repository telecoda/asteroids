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
    Global.POINTS_ASTEROID_PER_HIT = 50;
    Global.POINTS_PER_ENEMY_HIT = 500;
    Global.HUD_Y = 20;
    Global.HUD_BORDER = 20;
    Global.HEALTHBAR_HEIGHT = 10;
    Global.HEALTHBAR_WIDTH = 800;
    // ship
    Global.SHIP_DRAG = 100;
    Global.SHIP_MAX_VELOCITY = 300;
    Global.MAX_HEALTH = 1000;
    // asteroids
    Global.ASTEROID_MULTIPLIER = 2; // level * this = total asteroids
    Global.ASTEROID_DAMAGE = 1;
    Global.MAX_ASTEROID_VELOCITY = 200;
    // enemies
    Global.ENEMY_BULLET_DAMAGE = 5;
    Global.ENEMY_DAMAGE = 10;
    Global.MAX_ENEMY_VELOCITY = 200;
    Global.ENEMY_TIMER = 20; // number of seconds till new enemy appeaars
    // weapon
    Global.BULLET_SPEED = 300;
    Global.FIRE_RATE = 100;
    Global.MAX_BULLETS = 30;
    // particles
    Global.MAX_PARTICLES = 1000;
    // high score table
    Global.TOTAL_SCORES = 10;
    Global.NAME_LENGTH = 10;
    Global.DEL_CHAR = "@";
    Global.END_CHAR = "+";
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
            _this.state.add("GameOver", Asteroids.GameOver);
            _this.state.add("GameCompleted", Asteroids.GameCompleted);
            _this.state.add("HighScores", Asteroids.HighScores);
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
            _this.getSize = function () {
                return _this._size;
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
            // disable physics for asteroid
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
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        // -------------------------------------------------------------------------
        function Enemy(game, x, y, spaceship, fireDelay) {
            var _this = _super.call(this, game, 0, 0, "enemy") || this;
            _this._fireWeapon = function () {
                if (_this._isFiring && _this.game) {
                    _this.weapon.fireAtSprite(_this._spaceship);
                    _this._enemyLaserSound.play();
                    _this.game.time.events.add(Phaser.Timer.SECOND * _this._fireDelay, _this._fireWeapon, _this);
                }
            };
            _this.hitByBullet = function () {
                // destroy it
                _this.exists = false;
                _this._isFiring = false;
                return true;
            };
            _this.setGroup = function (group) {
                _this._group = group;
            };
            _this.addToGroup = function () {
                _this._group.add(_this);
            };
            _this.startMoving = function () {
                _this.body.velocity.x = (Asteroids.Global.MAX_ENEMY_VELOCITY / 2) - (Math.random() * Asteroids.Global.MAX_ENEMY_VELOCITY);
                _this.body.velocity.y = (Asteroids.Global.MAX_ENEMY_VELOCITY / 2) - (Math.random() * Asteroids.Global.MAX_ENEMY_VELOCITY);
            };
            _this._spaceship = spaceship;
            _this._fireDelay = fireDelay;
            // center enemy sprite horizontally
            _this.anchor.x = 0.5;
            _this.anchor.y = 0.5;
            // disable physics for asteroid
            game.physics.arcade.enable(_this, false);
            // no gravity
            var body = _this.body;
            body.allowGravity = false;
            body.angularVelocity = -100;
            body.maxVelocity.set(200);
            var bodyWidth = _this.width * 0.75;
            var bodyHeight = _this.height * 0.75;
            // offset body from upper left x,y coord by 1/8th the width (25% / 2)
            _this.body.setSize(bodyWidth, bodyHeight, _this.width / 4, _this.height / 4);
            _this.weapon = _this.game.add.weapon(Asteroids.Global.MAX_BULLETS, 'enemy-bullet');
            _this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            _this.weapon.bulletSpeed = Asteroids.Global.BULLET_SPEED;
            _this.weapon.fireRate = Asteroids.Global.FIRE_RATE;
            _this.weapon.trackSprite(_this, 0, 0, true);
            _this._isFiring = true;
            _this._enemyLaserSound = _this.game.add.audio('laser-2');
            _this.game.time.events.add(Phaser.Timer.SECOND * _this._fireDelay, _this._fireWeapon, _this);
            _this.x = x;
            _this.y = y;
            return _this;
        }
        return Enemy;
    }(Phaser.Sprite));
    Asteroids.Enemy = Enemy;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var HighScore = (function () {
        // -------------------------------------------------------------------------
        function HighScore(name, score, level) {
            var _this = this;
            this.getName = function () {
                return _this._name;
            };
            this.getScore = function () {
                return _this._score;
            };
            this.getLevel = function () {
                return _this._level;
            };
            this._name = name;
            this._score = score;
            this._level = level;
        }
        return HighScore;
    }());
    Asteroids.HighScore = HighScore;
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
            Asteroids.Global._score = 0;
            Asteroids.Global._level = 0;
            this.game.state.start("Preload");
        };
        return Boot;
    }(Phaser.State));
    Asteroids.Boot = Boot;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var GameCompleted = (function (_super) {
        __extends(GameCompleted, _super);
        function GameCompleted() {
            return _super.apply(this, arguments) || this;
        }
        // -------------------------------------------------------------------------
        GameCompleted.prototype.create = function () {
            // init background
            this._background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'stars');
            this._background.anchor.setTo(0.5, 0.5);
            this._background.alpha = 0.3;
            // title text 
            var titleFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().,' ";
            this._titleFont = this.game.add.retroFont('260-font', 48, 50, titleFontStr, 6, 0, 0);
            this._titleLabel = this.game.add.image(0, 0, this._titleFont);
            this._titleFont.setText("CONGRATULATIONS", true, 0, 0);
            this._titleLabel.x = this.game.width / 2 - this._titleLabel.width / 2;
            this._titleLabel.y = this.game.height + 50;
            // instructions
            var instFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/?!()-.,'\"0123456789";
            this._instFont = this.game.add.retroFont('16x16-font', 16, 16, instFontStr, 20, 0, 0);
            this._instLabel = this.game.add.image(0, 0, this._instFont);
            var instructions = "You have saved the galaxy.\n\n";
            instructions += "All the asteroids have been destroyed.\n\n";
            instructions += "It is now a safe place to fly you ship.\n\n\n";
            instructions += "You're a hero!\n\n";
            instructions += "Credits\n\n";
            instructions += "Coder: Telecoda\n\n";
            instructions += "Graphics: xxx\n\n";
            instructions += "Music: xxx\n";
            this._instFont.setText(instructions, true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
            this._instLabel.x = this.game.width / 2 - this._instLabel.width / 2;
            this._instLabel.y = this.game.height + 200;
            // text 
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-";
            this._gameCompletedFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._gameCompletedLabel = this.game.add.image(0, 0, this._gameCompletedFont);
            this._gameCompletedFont.setText("WELL DONE");
            this._gameCompletedLabel.x = this.game.width / 2 - this._gameCompletedLabel.width / 2;
            this._gameCompletedLabel.y = this.game.height + 600;
            this._gameCompletedLabel.tint = 0xff0000;
            var titleBounce = this.game.add.tween(this._titleLabel);
            titleBounce.to({ y: 50 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
            titleBounce.start();
            var instBounce = this.game.add.tween(this._instLabel);
            instBounce.to({ y: 200 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
            instBounce.start();
            var compBounce = this.game.add.tween(this._gameCompletedLabel);
            compBounce.to({ y: 600 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
            compBounce.start();
            // input
            this._continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        // -------------------------------------------------------------------------
        GameCompleted.prototype.update = function () {
            if (this._continueKey.isDown) {
                this.game.state.start("HighScores");
            }
        };
        GameCompleted.prototype.render = function () {
        };
        return GameCompleted;
    }(Phaser.State));
    Asteroids.GameCompleted = GameCompleted;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            return _super.apply(this, arguments) || this;
        }
        // -------------------------------------------------------------------------
        GameOver.prototype.create = function () {
            // init background
            this._background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'stars');
            this._background.anchor.setTo(0.5, 0.5);
            // text 
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-";
            this._gameOverFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._gameOverLabel = this.game.add.image(0, 0, this._gameOverFont);
            this._gameOverFont.setText("GAME OVER");
            this._gameOverLabel.x = this.game.width / 2 - this._gameOverLabel.width / 2;
            this._gameOverLabel.y = this.game.height / 2 - this._gameOverLabel.height / 2;
            // input
            this._continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        // -------------------------------------------------------------------------
        GameOver.prototype.update = function () {
            if (this._continueKey.isDown) {
                this.game.state.start("HighScores");
            }
        };
        GameOver.prototype.render = function () {
        };
        return GameOver;
    }(Phaser.State));
    Asteroids.GameOver = GameOver;
})(Asteroids || (Asteroids = {}));
var Asteroids;
(function (Asteroids) {
    var HighScores = (function (_super) {
        __extends(HighScores, _super);
        function HighScores() {
            var _this = _super.apply(this, arguments) || this;
            // state
            _this._enteringName = false;
            _this._loadScores = function () {
                // try to load from local storage
                var highscoresStr = localStorage.getItem("highscores");
                Asteroids.Global._highscores = new Array();
                if (!highscoresStr) {
                    // init default scores               
                    for (var i = 0; i < Asteroids.Global.TOTAL_SCORES; i++) {
                        var score = new Asteroids.HighScore("name" + i, i * 1000, i);
                        Asteroids.Global._highscores.push(score);
                    }
                }
                else {
                    // unmarshal scores
                    var scoresArray = JSON.parse(highscoresStr);
                    for (var _i = 0, scoresArray_1 = scoresArray; _i < scoresArray_1.length; _i++) {
                        var jsonScore = scoresArray_1[_i];
                        var score = new Asteroids.HighScore(jsonScore._name, jsonScore._score, jsonScore._level);
                        Asteroids.Global._highscores.push(score);
                    }
                    ;
                }
                // Sort scores into order
                Asteroids.Global._highscores = Asteroids.Global._highscores.sort(sortScores);
            };
            _this._saveScores = function () {
                var highscoresStr = JSON.stringify(Asteroids.Global._highscores);
                localStorage.setItem("highscores", highscoresStr);
            };
            _this._gotoMenu = function () {
                _this.game.state.start("Menu");
            };
            _this._letterBack = function () {
                if (_this._newLetterIndex > 0) {
                    _this._newLetterIndex--;
                }
                else {
                    _this._newLetterIndex = _this._fontStr.length - 1;
                }
                _this._updateNewName();
            };
            _this._letterForward = function () {
                if (_this._newLetterIndex < (_this._fontStr.length - 1)) {
                    _this._newLetterIndex++;
                }
                else {
                    _this._newLetterIndex = 0;
                }
                _this._updateNewName();
            };
            _this._enterScore = function () {
                var latestScore = new Asteroids.HighScore(_this._newName, Asteroids.Global._score, Asteroids.Global._level);
                Asteroids.Global._highscores.push(latestScore);
                Asteroids.Global._highscores = Asteroids.Global._highscores.sort(sortScores);
                Asteroids.Global._highscores = Asteroids.Global._highscores.slice(0, Asteroids.Global.TOTAL_SCORES);
                _this._saveScores();
                // reset current score
                Asteroids.Global._score = 0;
                Asteroids.Global._level = 0;
                _this.game.state.start("HighScores");
            };
            _this._letterSelected = function () {
                var selectedLetter = _this._fontStr[_this._newLetterIndex];
                switch (selectedLetter) {
                    case Asteroids.Global.DEL_CHAR:
                        _this._newName = _this._newName.slice(0, _this._newName.length - 1);
                        _this._updateNewName();
                        break;
                    case Asteroids.Global.END_CHAR:
                        _this._enterScore();
                        break;
                    default:
                        // select current letter
                        _this._newName += _this._fontStr[_this._newLetterIndex];
                        if (_this._newName.length == Asteroids.Global.NAME_LENGTH - 1) {
                            _this._enterScore();
                        }
                        else {
                            _this._updateNewName();
                        }
                }
            };
            // your got a high score!
            _this._newHighScore = function () {
                // text 
                _this._fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-@+";
                _this._newHighScoreFont = _this.game.add.retroFont('chrome-font', 31, 31, _this._fontStr, 10, 1, 1);
                _this._newHighScoresLabel = _this.game.add.image(0, 0, _this._newHighScoreFont);
                var newHighScore = "New high score!";
                _this._newHighScoreFont.setText(newHighScore, true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
                _this._newHighScoresLabel.x = _this.game.width / 2 - _this._newHighScoresLabel.width / 2;
                _this._newHighScoresLabel.y = _this.game.height / 2 - _this._newHighScoresLabel.height / 2 - 100;
                _this._newNameFont = _this.game.add.retroFont('chrome-font', 31, 31, _this._fontStr, 10, 1, 1);
                _this._newNameLabel = _this.game.add.image(0, 0, _this._newNameFont);
                _this._newNameLabel.tint = 0x00ff00;
                _this._newLetterFont = _this.game.add.retroFont('chrome-font', 31, 31, _this._fontStr, 10, 1, 1);
                _this._newLetterLabel = _this.game.add.image(0, 0, _this._newLetterFont);
                _this._newLetterLabel.tint = 0xff0000;
                _this._newName = "";
                _this._newLetterIndex = 0;
                _this._updateNewName();
            };
            _this._updateNewName = function () {
                if (_this._newName == "") {
                    _this._newNameFont.setText(" ", true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
                }
                else {
                    _this._newNameFont.setText(_this._newName, true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
                }
                _this._newNameLabel.x = _this.game.width / 2 - _this._newNameLabel.width / 2;
                _this._newNameLabel.y = _this.game.height / 2 - _this._newNameLabel.height / 2;
                _this._newLetter = _this._fontStr[_this._newLetterIndex];
                _this._newLetterFont.setText(_this._newLetter, true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
                _this._newLetterLabel.x = _this._newNameLabel.x + _this._newNameFont.width + _this._newLetterLabel.width;
                _this._newLetterLabel.y = _this.game.height / 2 - _this._newLetterLabel.height / 2;
            };
            _this._initTable = function () {
                // text 
                var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-";
                _this._highScoresFont = _this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
                _this._highScoresLabel = _this.game.add.image(0, 0, _this._highScoresFont);
                // convert list of scores to string to display
                var highScoreStr = "  Name        Level   Score   \n";
                highScoreStr += "------------------------------\n";
                for (var i = 0; i < Asteroids.Global._highscores.length; i++) {
                    var name_1 = padRight(Asteroids.Global._highscores[i].getName(), Asteroids.Global.NAME_LENGTH);
                    var level = padLeft(Asteroids.Global._highscores[i].getLevel().toString(), 5);
                    var score = padLeft(Asteroids.Global._highscores[i].getScore().toString(), 10);
                    var scoreStr = " " + name_1 + " " + level + " " + score + " \n\n";
                    highScoreStr += scoreStr;
                }
                _this._highScoresFont.setText(highScoreStr, true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
                _this._highScoresLabel.x = _this.game.width / 2 - _this._highScoresLabel.width / 2;
                _this._highScoresLabel.y = _this.game.height / 2 - _this._highScoresLabel.height / 2 + 100;
                // timers
                _this.game.time.events.add(Phaser.Timer.SECOND * 5, _this._showMenu, _this);
            };
            _this._showMenu = function () {
                // only go to menu if game is still on high scores
                if (_this.game.state.getCurrentState().key == "HighScores") {
                    _this.game.state.start("Menu");
                }
            };
            return _this;
        }
        // -------------------------------------------------------------------------
        HighScores.prototype.create = function () {
            // init background
            this._background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'stars');
            this._background.anchor.setTo(0.5, 0.5);
            this._background.alpha = 0.5;
            // title text 
            var titleFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().,' ";
            this._titleFont = this.game.add.retroFont('260-font', 48, 50, titleFontStr, 6, 0, 0);
            this._titleLabel = this.game.add.image(0, 0, this._titleFont);
            this._titleFont.setText("HIGH SCORES", true, 0, 0);
            this._titleLabel.x = this.game.width / 2 - this._titleLabel.width / 2;
            this._titleLabel.y = 50;
            // input
            this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            // highscores
            this._loadScores();
            this._saveScores();
            // check if current score fits in highscore table
            if (Asteroids.Global._score > Asteroids.Global._highscores[Asteroids.Global.TOTAL_SCORES - 1].getScore()) {
                this._enteringName = true;
                this._leftKey.onDown.add(this._letterBack, this);
                this._rightKey.onDown.add(this._letterForward, this);
                this._fireKey.onDown.add(this._letterSelected, this);
                this._newHighScore();
            }
            else {
                this._enteringName = false;
                this._fireKey.onDown.add(this._gotoMenu, this);
                this._initTable();
            }
        };
        // -------------------------------------------------------------------------
        HighScores.prototype.update = function () {
        };
        return HighScores;
    }(Phaser.State));
    Asteroids.HighScores = HighScores;
    function sortScores(s1, s2) {
        return s2.getScore() - s1.getScore();
    }
})(Asteroids || (Asteroids = {}));
function padLeft(value, width) {
    if (value.length < width) {
        // pad string
        for (var i = 0; value.length < width; i++) {
            value = " " + value;
        }
        return value;
    }
    else {
        return value.slice(0, width);
    }
}
function padRight(value, width) {
    if (value.length < width) {
        // pad string
        for (var i = 0; value.length < width; i++) {
            value = value + " ";
        }
        return value;
    }
    else {
        return value.slice(0, width);
    }
}
var Asteroids;
(function (Asteroids) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            var _this = _super.apply(this, arguments) || this;
            _this._showHighScores = function () {
                // only go to high scores if game is still on menu
                if (_this.game.state.getCurrentState().key == "Menu") {
                    _this.game.state.start("HighScores");
                }
            };
            return _this;
        }
        // -------------------------------------------------------------------------
        Menu.prototype.create = function () {
            // init background
            this._background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'stars');
            this._background.anchor.setTo(0.5, 0.5);
            this._background.alpha = 0.5;
            // title text 
            var titleFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().,' ";
            this._titleFont = this.game.add.retroFont('260-font', 48, 50, titleFontStr, 6, 0, 0);
            this._titleLabel = this.game.add.image(0, 0, this._titleFont);
            this._titleFont.setText("ASTEROIDS", true, 0, 0);
            this._titleLabel.x = this.game.width / 2 - this._titleLabel.width / 2;
            this._titleLabel.y = 50;
            // instructions
            var instFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/?!()-.,'\"0123456789";
            this._instFont = this.game.add.retroFont('16x16-font', 16, 16, instFontStr, 20, 0, 0);
            this._instLabel = this.game.add.image(0, 0, this._instFont);
            var instructions = "Welcome to Asteroids.\n\n";
            instructions += "The object of the game is to destroy all the asteroids\n\n";
            instructions += "Without sustaining too much damage to your ship\n\n\n";
            instructions += "Controls:\n\n";
            instructions += "<LEFT> - Rotate ship left\n\n";
            instructions += "<RIGHT> - Rotate ship right\n\n";
            instructions += "<UP> - Thruster\n\n";
            instructions += "<SPACE> - Fire\n";
            this._instFont.setText(instructions, true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
            this._instLabel.x = this.game.width / 2 - this._instLabel.width / 2;
            this._instLabel.y = 200;
            // start text 
            var startFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-";
            this._startFont = this.game.add.retroFont('chrome-font', 31, 31, startFontStr, 10, 1, 1);
            this._startLabel = this.game.add.image(0, 0, this._startFont);
            this._startFont.setText("Press SPACE to start");
            this._startLabel.x = this.game.width / 2 - this._startLabel.width / 2;
            this._startLabel.y = this.game.height / 2 - this._startLabel.height / 2 + 150;
            // credits
            this._creditsFont = this.game.add.retroFont('16x16-font', 16, 16, instFontStr, 20, 0, 0);
            this._creditsLabel = this.game.add.image(0, 0, this._creditsFont);
            var credits = "Written by telecoda (c) 2017";
            this._creditsFont.setText(credits, true, 0, 0, Phaser.RetroFont.ALIGN_CENTER);
            this._creditsLabel.x = this.game.width / 2 - this._creditsLabel.width / 2;
            this._creditsLabel.y = this.game.height - 50;
            this._creditsLabel.tint = 0xff0000;
            // input
            this._startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            // timers
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this._showHighScores, this);
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
            _this._startThruster = function () {
                _this._thruster.start(true, 500, null, 1);
            };
            _this._updateHealthBar = function () {
                _this._healthBar.x = _this.game.width / 2 - Asteroids.Global.HEALTHBAR_WIDTH / 2;
                _this._healthBar.y = _this.game.height - Asteroids.Global.HEALTHBAR_HEIGHT - Asteroids.Global.HUD_BORDER;
                _this._healthBar.clear();
                // draw green
                _this._healthBar.beginFill(0x00ff00);
                var healthEnd = _this._spaceship.health * (Asteroids.Global.HEALTHBAR_WIDTH / Asteroids.Global.MAX_HEALTH);
                _this._healthBar.drawRect(0, 0, healthEnd, Asteroids.Global.HEALTHBAR_HEIGHT);
                _this._healthBar.endFill();
                // draw red
                _this._healthBar.beginFill(0xff0000);
                _this._healthBar.drawRect(healthEnd, 0, Asteroids.Global.HEALTHBAR_WIDTH - healthEnd, Asteroids.Global.HEALTHBAR_HEIGHT);
                _this._healthBar.endFill();
            };
            _this._updateThruster = function () {
                _this._thruster.emitX = _this._spaceship.x;
                _this._thruster.emitY = _this._spaceship.y;
            };
            _this._startNewGame = function () {
                _this._setStatus("Start level 1");
                _this._state = Play.LEVEL_START;
                Asteroids.Global._lives = Asteroids.Global.TOTAL_LIVES;
                Asteroids.Global._score = 0;
                Asteroids.Global._level = 1;
                _this._increaseScore(0); // init score label
                _this._resetPlayer(Asteroids.Global.MAX_HEALTH);
                _this._updateHealthBar();
                _this._updateLivesText();
                _this._startLevel();
            };
            _this._startLevel = function () {
                _this._setStatus("Starting level " + Asteroids.Global._level);
                _this._state = Play.LEVEL_START;
                _this._levelFont.setText("Level:" + Asteroids.Global._level);
                _this._levelLabel.y = Asteroids.Global.HUD_Y;
                _this._levelLabel.x = Asteroids.Global.HUD_BORDER;
                _this._asteroidCount = Asteroids.Global._level * Asteroids.Global.ASTEROID_MULTIPLIER;
                _this._initAsteroids(Asteroids.Global._level * Asteroids.Global.ASTEROID_MULTIPLIER);
                _this._initEnemies(Asteroids.Global._level);
                //  Wait 2 seconds then start level
                _this.game.time.events.add(Phaser.Timer.SECOND * 2, _this._startPlaying, _this);
            };
            _this._startNextLevel = function () {
                _this._setStatus("");
                if (Asteroids.Global._level < Asteroids.Global.TOTAL_LEVELS) {
                    Asteroids.Global._level++;
                    _this._resetPlayer(_this._spaceship.health); // reset play but dont change health
                    _this._startLevel();
                }
                else {
                    // game complete!
                    _this._gameCompleted();
                }
            };
            _this._levelCompleted = function () {
                _this._setStatus("Level " + Asteroids.Global._level + " complete");
                _this._state = Play.LEVEL_END;
                //  Wait 2 seconds then start a next level
                _this.game.time.events.add(Phaser.Timer.SECOND * 2, _this._startNextLevel, _this);
            };
            _this._gameCompleted = function () {
                _this._state = Play.GAME_COMPLETED;
                _this.game.state.start("GameCompleted");
            };
            _this._gameOver = function () {
                _this.game.state.start("GameOver");
            };
            _this._startPlaying = function () {
                _this._hideStatus();
                _this._state = Play.PLAYING;
            };
            _this._resetPlayer = function (health) {
                _this._spaceship.health = health;
                //this._spaceship.body.reset();
                _this._spaceship.body.drag.set(Asteroids.Global.SHIP_DRAG);
                _this._spaceship.body.maxVelocity.set(Asteroids.Global.SHIP_MAX_VELOCITY);
                _this._spaceship.body.angularVelocity = 0;
                _this._spaceship.angle = -90;
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
                Asteroids.Global._lives--;
                _this._updateLivesText();
                if (Asteroids.Global._lives < 1) {
                    _this._gameOver();
                    return;
                }
                _this._resetPlayer(Asteroids.Global.MAX_HEALTH);
                _this._resumePlaying();
            };
            _this._pauseToggle = function () {
                _this.game.paused = !_this.game.paused;
            };
            _this._setStatus = function (text) {
                _this._statusFont.setText(text);
                _this._statusLabel.x = _this.game.width / 2 - _this._statusLabel.width / 2;
                _this._statusLabel.y = _this.game.height / 2 - _this._statusLabel.height / 2;
                _this._statusLabel.visible = true;
            };
            _this._hideStatus = function () {
                _this._statusLabel.visible = false;
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
            _this._initEnemies = function (count) {
                if (_this._enemies) {
                    _this._enemies.destroy(true);
                }
                _this._enemies = new Phaser.Group(_this.game);
                for (var i = 0; i < count; i++) {
                    _this._addEnemy();
                }
            };
            _this._addEnemy = function () {
                if (_this._state == Play.PLAYING || _this._state == Play.LEVEL_START) {
                    var x = _this.game.width * Math.random();
                    var y = -50;
                    var enemy = new Asteroids.Enemy(_this.game, x, y, _this._spaceship, 10 - Asteroids.Global._level);
                    enemy.setGroup(_this._enemies);
                    enemy.addToGroup();
                    enemy.startMoving();
                    _this.game.time.events.add(Phaser.Timer.SECOND * Asteroids.Global.ENEMY_TIMER, _this._addEnemy, _this);
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
                _this._increaseScore(Asteroids.Global.POINTS_ASTEROID_PER_HIT);
                // create explosion
                _this._createExplosionAt(bullet.x, bullet.y);
                _this._explosionSound1.play();
            };
            _this._bulletHitEnemy = function (bullet, enemy) {
                bullet.kill();
                var destroyed = enemy.hitByBullet();
                _this._increaseScore(Asteroids.Global.POINTS_PER_ENEMY_HIT);
                // create explosion
                _this._createExplosionAt(enemy.x, enemy.y);
                _this._explosionSound2.play();
            };
            _this._bulletHitBullet = function (playerBullet, enemyBullet) {
                playerBullet.kill();
                enemyBullet.kill();
                // create explosion
                _this._createExplosionAt(playerBullet.x, playerBullet.y);
                _this._createExplosionAt(enemyBullet.x, enemyBullet.y);
                _this._explosionSound2.play();
            };
            _this._bulletHitSpaceship = function (spaceship, enemyBullet) {
                enemyBullet.kill();
                // create explosion
                _this._createExplosionAt(enemyBullet.x, enemyBullet.y);
                _this._explosionSound2.play();
                _this._spaceship.health -= Asteroids.Global.ENEMY_BULLET_DAMAGE;
                // change colour briefly
                if (_this._spaceship.health > 0) {
                    _this._spaceship.loadTexture("spaceship-hit");
                    _this.game.time.events.add(Phaser.Timer.SECOND * 0.1, _this._resetShipTexture.bind(_this));
                }
            };
            _this._updateLivesText = function () {
                _this._livesFont.setText("Lives:" + Asteroids.Global._lives);
                _this._livesLabel.y = Asteroids.Global.HUD_Y;
                _this._livesLabel.x = _this.game.width - _this._livesLabel.width - Asteroids.Global.HUD_BORDER;
            };
            _this._increaseScore = function (inc) {
                Asteroids.Global._score += inc;
                _this._scoreFont.setText("Score:" + Asteroids.Global._score);
                _this._scoreLabel.y = Asteroids.Global.HUD_Y;
                _this._scoreLabel.x = _this.game.width / 2 - _this._scoreLabel.width / 2;
            };
            _this._createExplosionAt = function (x, y) {
                var explosion = new Phaser.Sprite(_this.game, x, y);
                explosion.anchor.x = 0.5;
                explosion.anchor.y = 0.5;
                explosion.loadTexture("explosion", 0);
                explosion.animations.add("boom");
                explosion.animations.play("boom", 10, false, true);
                _this._explosions.add(explosion);
            };
            _this._spaceshipHitAsteroid = function (spaceship, asteroid) {
                spaceship.health -= (Asteroids.Global.ASTEROID_DAMAGE * asteroid.getSize());
                _this._explosionSound3.play();
                // change colour briefly
                if (spaceship.health > 0) {
                    spaceship.loadTexture("spaceship-hit");
                    _this.game.time.events.add(Phaser.Timer.SECOND * 0.1, _this._resetShipTexture.bind(_this));
                }
            };
            _this._spaceshipHitEnemy = function (spaceship, enemy) {
                spaceship.health -= Asteroids.Global.ENEMY_DAMAGE;
                _this._explosionSound3.play();
                // change colour briefly
                if (spaceship.health > 0) {
                    spaceship.loadTexture("spaceship-hit");
                    _this.game.time.events.add(Phaser.Timer.SECOND * 0.1, _this._resetShipTexture.bind(_this));
                }
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
            // particles
            this._thruster = this.game.add.emitter(0, 0, Asteroids.Global.MAX_PARTICLES);
            this._thruster.makeParticles("thruster");
            this._thruster.setXSpeed(0, 0);
            this._thruster.setYSpeed(0, 0);
            this._thruster.setRotation(0, 0);
            this._thruster.setAlpha(0.1, 1, 3000);
            this._thruster.setScale(1, 0.0, 1, 0.0, 3000, Phaser.Easing.Quintic.Out);
            this._thruster.gravity = 0;
            // init spaceship
            this._spaceship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'spaceship');
            this._spaceship.anchor.setTo(0.5, 0.5);
            this._spaceship.angle = 0;
            this._spaceship.scale = new Phaser.Point(0.5, 0.5);
            this._thruster.emitX = this._spaceship.x;
            this._thruster.emitY = this._spaceship.y;
            //  and its physics settings
            this.game.physics.enable(this._spaceship, Phaser.Physics.ARCADE);
            this._weapon = this.game.add.weapon(Asteroids.Global.MAX_BULLETS, 'bullet');
            this._weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            this._weapon.bulletSpeed = Asteroids.Global.BULLET_SPEED;
            this._weapon.fireRate = Asteroids.Global.FIRE_RATE;
            this._weapon.trackSprite(this._spaceship, 0, 0, true);
            // hud 
            this._hud = new Phaser.Group(this.game);
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-";
            this._scoreFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._scoreLabel = this.game.add.image(0, 0, this._scoreFont);
            this._levelFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._levelLabel = this.game.add.image(0, 0, this._levelFont);
            this._livesFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._livesLabel = this.game.add.image(0, 0, this._livesFont);
            this._statusFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._statusLabel = this.game.add.image(0, 0, this._statusFont);
            // healthbar
            this._healthBar = this.game.add.graphics(0, 0);
            this._updateHealthBar();
            this._hud.add(this._scoreLabel);
            this._hud.add(this._levelLabel);
            this._hud.add(this._livesLabel);
            this._hud.add(this._healthBar);
            // animations
            this._explosions = new Phaser.Group(this.game);
            // audio
            this._music = this.game.add.audio('music');
            this._playerLaserSound = this.game.add.audio('laser-1');
            this._playerLaserSound.volume = 2;
            this._explosionSound1 = this.game.add.audio('explosion-1');
            this._explosionSound1.volume = 10;
            this._explosionSound2 = this.game.add.audio('explosion-2');
            this._explosionSound2.volume = 10;
            this._explosionSound3 = this.game.add.audio('explosion-3');
            this._explosionSound3.volume = 5;
            this._hyperspaceSound = this.game.add.audio('hyperspace');
            this._music.play();
            this._music.volume = 6;
            // setup input
            this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this._thrustKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this._pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
            this._pauseKey.onDown.add(this._pauseToggle, this);
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
                    this._enemies.forEachExists(function (sprite) {
                        this._wrapLocation(sprite);
                    }, this);
                    //  Collision detection
                    // player bullet hits asteroid
                    this.game.physics.arcade.overlap(this._weapon.bullets, this._asteroids, this._bulletHitAsteroid, null, this);
                    // player hits asteroid
                    this.game.physics.arcade.overlap(this._spaceship, this._asteroids, this._spaceshipHitAsteroid, null, this);
                    // player hits enemy 
                    this.game.physics.arcade.overlap(this._spaceship, this._enemies, this._spaceshipHitEnemy, null, this);
                    // players bullet hits enemy
                    this.game.physics.arcade.overlap(this._weapon.bullets, this._enemies, this._bulletHitEnemy, null, this);
                    this._enemies.forEachExists(function (enemy) {
                        // players bullet hits enemy bullet
                        this.game.physics.arcade.overlap(this._weapon.bullets, enemy.weapon.bullets, this._bulletHitBullet, null, this);
                        // enemy bullet hits player
                        this.game.physics.arcade.overlap(enemy.weapon.bullets, this._spaceship, this._bulletHitSpaceship, null, this);
                    }, this);
                    this.game.physics.arcade.overlap(this._weapon.bullets, this._enemies, this._bulletHitEnemy, null, this);
                    // update health display
                    // health remaining
                    this._updateHealthBar();
                    this._updateThruster();
                    break;
                }
            }
        };
        Play.prototype.render = function () {
            this.game.debug.text("fps:" + this.game.time.fps.toString(), 2, 80, "#ffffff");
        };
        Play.prototype._resetShipTexture = function () {
            this._spaceship.loadTexture("spaceship");
        };
        Play.prototype._handleInput = function () {
            if (this._thrustKey.isDown) {
                this._startThruster();
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
                // play sound
                this._playerLaserSound.play();
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
    Play.GAME_COMPLETED = 5;
    Play.PAUSED = 6;
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
            // images
            this.load.image("stars", "assets/stars.png");
            this.load.image("asteroid-01", "assets/asteroid-01.png");
            this.load.image("spaceship", "assets/spaceship.png");
            this.load.image("spaceship-hit", "assets/spaceship-hit.png");
            this.load.image("bullet", "assets/bullet.png");
            this.load.image("enemy", "assets/enemy.png");
            this.load.image("enemy-bullet", "assets/enemy-bullet.png");
            this.load.spritesheet("explosion", "assets/explosion_spritesheet.png", 128, 128, 70);
            this.load.image("thruster", "assets/particles/red.png");
            this.game.load.image('chrome-font', 'assets/fonts/ST_ADM.GIF');
            this.game.load.image('16x16-font', 'assets/fonts/16x16-cool-metal.png');
            this.game.load.image('260-font', 'assets/fonts/260.png');
            // audio
            this.game.load.audio('music', 'assets/audio/TheLoomingBattle.ogg');
            this.game.load.audio('explosion-1', 'assets/audio/explosion06.ogg');
            this.game.load.audio('explosion-2', 'assets/audio/explosion07.ogg');
            this.game.load.audio('explosion-3', 'assets/audio/Explosion4.ogg');
            this.game.load.audio('hyperspace', 'assets/audio/Jump3.ogg');
            this.game.load.audio('laser-1', 'assets/audio/Laser_Shoot.ogg');
            this.game.load.audio('laser-2', 'assets/audio/Laser_Shoot5.ogg');
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