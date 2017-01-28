namespace Asteroids {

    export class HighScores extends Phaser.State {

        private _background: Phaser.Sprite;
        // text
        private _titleFont: Phaser.RetroFont;
        private _titleLabel: Phaser.Image;

        private _highScoresFont: Phaser.RetroFont;
        private _highScoresLabel: Phaser.Image;

        private _newHighScoreFont: Phaser.RetroFont;
        private _newHighScoresLabel: Phaser.Image;

        // input
        private _continueKey: Phaser.Key;

        // -------------------------------------------------------------------------
        public create() {
            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo(0.5, 0.5);
            this._background.alpha = 0.5;
 
            // title text 
            var titleFontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!().,' ";
            this._titleFont = this.game.add.retroFont('260-font', 48, 50, titleFontStr, 6, 0, 0);
            this._titleLabel = this.game.add.image(0,0,this._titleFont);            
            this._titleFont.setText("HIGH SCORES", true,0,0)
            this._titleLabel.x = this.game.width/2 - this._titleLabel.width/2;
            this._titleLabel.y = 50;


            // Sort scores into order
            Global._highscores = Global._highscores.sort(sortScores);

            // check if current score fits in highscore table
            if (Global._score > Global._highscores[Global.TOTAL_SCORES-1].getScore()) {
                this._newHighScore();
                return
            }

            // text 
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-"
            this._highScoresFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._highScoresLabel = this.game.add.image(0,0,this._highScoresFont);            
            // convert list of scores to string to display
            let highScoreStr = "  Name        Level   Score   \n";
            highScoreStr +=    "------------------------------\n";
            for(let i=0; i<Global._highscores.length; i++) {
                let name = padRight(Global._highscores[i].getName(),10);
                let level = padLeft(Global._highscores[i].getLevel().toString(),5);
                let score = padLeft(Global._highscores[i].getScore().toString(),10);
                let scoreStr = ` ${name} ${level} ${score} \n\n`;
                highScoreStr += scoreStr;
            }
            this._highScoresFont.setText(highScoreStr,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._highScoresLabel.x = this.game.width/2 - this._highScoresLabel.width/2;
            this._highScoresLabel.y = this.game.height/2 - this._highScoresLabel.height/2 + 100; 
  
            // input
            this._continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            // timers
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this._showMenu, this);

        }

        // -------------------------------------------------------------------------
        public update() {
            if (this._continueKey.isDown) {
                this.game.state.start("Menu");
            }
        }

        // your got a high score!
        private _newHighScore = () => {
            // text 
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-"
            this._newHighScoreFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._newHighScoresLabel = this.game.add.image(0,0,this._newHighScoreFont);            
            let newHighScore = "New high score!";
            this._newHighScoreFont.setText(newHighScore,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._newHighScoresLabel.x = this.game.width/2 - this._newHighScoresLabel.width/2;
            this._newHighScoresLabel.y = this.game.height/2 - this._newHighScoresLabel.height/2 + 100; 
  
        }

        private _showMenu = () => {
            // only go to menu if game is still on high scores
            if (this.game.state.getCurrentState().key == "HighScores") {
                this.game.state.start("Menu");
            }
        }

    }


    export function sortScores(s1: HighScore, s2: HighScore):number {
        return s2.getScore()-s1.getScore();
    }
}

function padLeft(value: string, width: number):string {
    if (value.length < width) {
        // pad string
        for (let i=0;value.length<width; i++){
            value = " " + value;
        }
        return value;
    } else {
        return value.slice(0,width);
    }
}

function padRight(value: string, width: number):string {
    if (value.length < width) {
        // pad string
        for (let i=0;value.length<width; i++){
            value = value + " ";
        }
        return value;
    } else {
        return value.slice(0,width);
    }

}

