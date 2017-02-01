namespace Asteroids {

    export class GameCompleted extends Phaser.State {

        private _background: Phaser.Sprite;
        // text
        private _titleFont: Phaser.RetroFont;
        private _titleLabel: Phaser.Image;
        private _instFont: Phaser.RetroFont;
        private _instLabel: Phaser.Image;
    
        private _gameCompletedFont: Phaser.RetroFont;
        private _gameCompletedLabel: Phaser.Image;
        // input
        private _continueKey: Phaser.Key;

        // -------------------------------------------------------------------------
        public create() {
            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo( 0.5, 0.5 );
            this._background.alpha = 0.3;

            // title text 
            let titleFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().,' ";
            this._titleFont = this.game.add.retroFont('260-font', 48, 50, titleFontStr, 6, 0, 0);
            this._titleLabel = this.game.add.image(0,0,this._titleFont);            
            this._titleFont.setText("CONGRATULATIONS", true,0,0)
            this._titleLabel.x = this.game.width/2 - this._titleLabel.width/2;
            this._titleLabel.y = this.game.height + 50;

            // instructions
            let instFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/?!()-.,'\"0123456789";
            this._instFont = this.game.add.retroFont('16x16-font', 16, 16, instFontStr, 20, 0, 0);
            this._instLabel = this.game.add.image(0,0,this._instFont);          
            let instructions = "You have saved the galaxy.\n\n"
            instructions += "All the asteroids have been destroyed.\n\n"
            instructions += "It is now a safe place to fly you ship.\n\n\n"
            instructions += "You're a hero!\n\n"
            instructions += "Credits\n\n"
            instructions += "Coder: Telecoda\n\n"
            instructions += "Graphics: xxx\n\n"
            instructions += "Music: xxx\n"
            this._instFont.setText(instructions,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._instLabel.x = this.game.width/2 - this._instLabel.width/2;
            this._instLabel.y = this.game.height + 200; 

            // text 
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-"
            this._gameCompletedFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._gameCompletedLabel = this.game.add.image(0,0,this._gameCompletedFont);            
            this._gameCompletedFont.setText("WELL DONE")
            this._gameCompletedLabel.x = this.game.width/2 - this._gameCompletedLabel.width/2;
            this._gameCompletedLabel.y = this.game.height + 600; 
            this._gameCompletedLabel.tint = 0xff0000;

            var titleBounce=this.game.add.tween(this._titleLabel);
            titleBounce.to({ y: 50 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
            titleBounce.start();

            var instBounce=this.game.add.tween(this._instLabel);
            instBounce.to({ y: 200 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
            instBounce.start();

            var compBounce=this.game.add.tween(this._gameCompletedLabel);
            compBounce.to({ y: 600 }, 1000 + Math.random() * 3000, Phaser.Easing.Bounce.In);
            compBounce.start();
  
            // input
            this._continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        }

        // -------------------------------------------------------------------------
        public update() {
            if (this._continueKey.isDown) {
                this.game.state.start("HighScores");
            }
        }

        public render() {
		}
    }
}
