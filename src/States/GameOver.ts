namespace Asteroids {

    export class GameOver extends Phaser.State {

        private _background: Phaser.Sprite;
        private _gameOverText: Phaser.Text;
        // input
        private _continueKey: Phaser.Key;

        // -------------------------------------------------------------------------
        public create() {
            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo( 0.5, 0.5 );

            // text 
            var textStyle = { font: "72px Arial", fill: "#ff0000", align: "center" };
            this._gameOverText = this.game.add.text(50,50, "Game Over", textStyle )
            this._gameOverText.x = this.game.width/2 - this._gameOverText.width/2;
            this._gameOverText.y = this.game.height/2 - this._gameOverText.height/2; 
            this._continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        }

        // -------------------------------------------------------------------------
        public update() {
            if (this._continueKey.isDown) {
                this.game.state.start("Menu");
            }
        }

        public render() {
			this.game.debug.text("Score:" + Global._score, 100, 14, "#ffffff");
			this.game.debug.text("Lives:" + Global._lives, 300, 14, "#ffffff");
			this.game.debug.text("Level:" + Global._level, 400, 14, "#ffffff");
		}
    }
}