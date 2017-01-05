namespace Asteroids {

    export class Play extends Phaser.State {

        private _background: Phaser.Sprite;
        private _asteroid: Phaser.Sprite;

        // status
        private _gameOver: boolean = false;

        // input
        private _leftKey: Phaser.Key;
        private _rightKey: Phaser.Key;

		public render() {
			this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#ffffff");
		}

        // -------------------------------------------------------------------------
        public create() {

            // enable fps
            this.game.time.advancedTiming = true;

            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo( 0.5, 0.5 );
			// init asteroids
			this._asteroid = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'asteroid-01' );
			this._asteroid.anchor.setTo( 0.5, 0.5 );
		
			// setup input
			this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
			this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)


        }

        // -------------------------------------------------------------------------
        public update() {
            		if (this._leftKey.isDown) {
				this._asteroid.rotation -= 0.05;
			}
			if (this._rightKey.isDown) {
				this._asteroid.rotation += 0.05;
			}
        }
    }
}
