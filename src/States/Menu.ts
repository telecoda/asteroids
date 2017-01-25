namespace Asteroids {

    export class Menu extends Phaser.State {

        private _background: Phaser.Sprite;
        // input
        private _startKey: Phaser.Key;
        // text
        private _titleFont: Phaser.RetroFont;
        private _titleLabel: Phaser.Image;
        private _startFont: Phaser.RetroFont;
        private _startLabel: Phaser.Image;
        private _instFont: Phaser.RetroFont;
        private _instLabel: Phaser.Image;
        private _creditsFont: Phaser.RetroFont;
        private _creditsLabel: Phaser.Image;

        // -------------------------------------------------------------------------
        public create() {
            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo( 0.5, 0.5 );
            this._background.alpha = 0.5;
    
            // title text 
            var titleFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().,' ";
            this._titleFont = this.game.add.retroFont('260-font', 48, 50, titleFontStr, 6, 0, 0);
            this._titleLabel = this.game.add.image(0,0,this._titleFont);            
            this._titleFont.setText("ASTEROIDS", true,0,0)
            this._titleLabel.x = this.game.width/2 - this._titleLabel.width/2;
            this._titleLabel.y = 50;

            // instructions
            var instFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/?!()-.,'\"0123456789";
            this._instFont = this.game.add.retroFont('16x16-font', 16, 16, instFontStr, 20, 0, 0);
            this._instLabel = this.game.add.image(0,0,this._instFont);          
            var instructions = "Welcome to Asteroids.\n\n"
            instructions += "The object of the game is to destroy all the asteroids\n"
            instructions += "Without sustaining too much damage to your ship\n\n"
            instructions += "Controls:\n\n"
            instructions += "<LEFT> - Rotate ship left\n\n"
            instructions += "<RIGHT> - Rotate ship right\n\n"
            instructions += "<UP> - Thruster\n"
            instructions += "<SPACE> - Fire\n"
            this._instFont.setText(instructions,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._instLabel.x = this.game.width/2 - this._instLabel.width/2;
            this._instLabel.y = 200; 

            // start text 
            var startFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-"
            this._startFont = this.game.add.retroFont('chrome-font', 31, 31, startFontStr, 10, 1, 1);
            this._startLabel = this.game.add.image(0,0,this._startFont);            
            this._startFont.setText("Press SPACE to start")
            this._startLabel.x = this.game.width/2 - this._startLabel.width/2;
            this._startLabel.y = this.game.height/2 - this._startLabel.height/2 + 150; 

            // credits
            this._creditsFont = this.game.add.retroFont('16x16-font', 16, 16, instFontStr, 20, 0, 0);
            this._creditsLabel = this.game.add.image(0,0,this._creditsFont);          
            var credits = "Written by telecoda (c) 2017"
            this._creditsFont.setText(credits,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._creditsLabel.x = this.game.width/2 - this._creditsLabel.width/2;
            this._creditsLabel.y = this.game.height - 50; 
            this._creditsLabel.tint = 0xff0000;

            // input
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
