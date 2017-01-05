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
            // status
            _this._gameOver = false;
            return _this;
        }
        Play.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#ffffff");
        };
        // -------------------------------------------------------------------------
        Play.prototype.create = function () {
            // enable fps
            this.game.time.advancedTiming = true;
            // init background
            this._background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'stars');
            this._background.anchor.setTo(0.5, 0.5);
            // init asteroids
            this._asteroid = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'asteroid-01');
            this._asteroid.anchor.setTo(0.5, 0.5);
            // setup input
            this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        };
        // -------------------------------------------------------------------------
        Play.prototype.update = function () {
            if (this._leftKey.isDown) {
                this._asteroid.rotation -= 0.05;
            }
            if (this._rightKey.isDown) {
                this._asteroid.rotation += 0.05;
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