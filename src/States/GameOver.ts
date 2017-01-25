namespace Asteroids {

    export class GameOver extends Phaser.State {

        private _background: Phaser.Sprite;
           // text
        private _gameOverFont: Phaser.RetroFont;
        private _gameOverLabel: Phaser.Image;
        // input
        private _continueKey: Phaser.Key;

        // -------------------------------------------------------------------------
        public create() {
            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo( 0.5, 0.5 );

            // text 
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-"
            this._gameOverFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._gameOverLabel = this.game.add.image(0,0,this._gameOverFont);            
            this._gameOverFont.setText("Press SPACE to start")
            this._gameOverLabel.x = this.game.width/2 - this._gameOverLabel.width/2;
            this._gameOverLabel.y = this.game.height/2 - this._gameOverLabel.height/2; 
  
            // input
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
