namespace Asteroids {

    export class Menu extends Phaser.State {

        private _background: Phaser.Sprite;
        private _startText: Phaser.Text;
        // input
        private _startKey: Phaser.Key;

        // -------------------------------------------------------------------------
        public create() {
            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo( 0.5, 0.5 );

            // text 
            var textStyle = { font: "72px Arial", fill: "#ffffff", align: "center" };
            this._startText = this.game.add.text(50,50, "Press SPACE to start", textStyle )
            this._startText.x = this.game.width/2 - this._startText.width/2;
            this._startText.y = this.game.height/2 - this._startText.height/2; 
            this._startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        }

        // -------------------------------------------------------------------------
        public update() {
            if (this._startKey.isDown) {
                this.game.state.start("Play");
            }
        }
    }
}
