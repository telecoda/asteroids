/// <reference path="../tsDefinitions/phaser.d.ts" />
var AsteroidGame = (function () {
    function AsteroidGame() {
        this.game = new Phaser.Game(1024, 800, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    AsteroidGame.prototype.preload = function () {
        this.game.load.image('background', "assets/stars.png");
        this.game.load.image('asteroid-01', "assets/asteroid-01.png");
        this.game.stage.backgroundColor = 0x000000;
        this.game.time.advancedTiming = true;
        // setup input
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    };
    AsteroidGame.prototype.create = function () {
        this.background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
        this.background.anchor.setTo(0.5, 0.5);
        // init asteroids
        this.asteroid = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'asteroid-01');
        this.asteroid.anchor.setTo(0.5, 0.5);
    };
    AsteroidGame.prototype.update = function () {
        if (this.leftKey.isDown) {
            this.asteroid.rotation -= 0.05;
        }
        if (this.rightKey.isDown) {
            this.asteroid.rotation += 0.05;
        }
    };
    AsteroidGame.prototype.render = function () {
        this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#ffffff");
    };
    return AsteroidGame;
}());
// when the page has finished loading, create our game
window.onload = function () {
    var game = new AsteroidGame();
};
//# sourceMappingURL=game.js.map