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

        private _newNameFont: Phaser.RetroFont;
        private _newNameLabel: Phaser.Image;
        private _newLetterFont: Phaser.RetroFont;
        private _newLetterLabel: Phaser.Image;

        private _fontStr: string;
        private _newName: string;
        private _newLetter: string;
        private _newLetterIndex: number;
        // input
        private _leftKey: Phaser.Key;
        private _rightKey: Phaser.Key;
        private _fireKey: Phaser.Key;

        // state
        private _enteringName: boolean = false;

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

            // input
  			this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  
            // highscores

            this._loadScores();


            this._saveScores();

            // check if current score fits in highscore table
            if (Global._score > Global._highscores[Global.TOTAL_SCORES-1].getScore()) {
                this._enteringName = true;
                this._leftKey.onDown.add(this._letterBack, this);
                this._rightKey.onDown.add(this._letterForward, this);
                this._fireKey.onDown.add(this._letterSelected, this);
                this._newHighScore();
            } else {
                this._enteringName = false;
                this._fireKey.onDown.add(this._gotoMenu, this);
                this._initTable();
            }

          
        }

        private _loadScores = () => {
            // try to load from local storage
            let highscoresStr:string = localStorage.getItem("highscores");

            Global._highscores = new Array<HighScore>();

            if (!highscoresStr) {
                // init default scores               
                for (let i=0; i< Global.TOTAL_SCORES; i++) {
                    let score = new HighScore("name"+i, i*1000,i);
                    Global._highscores.push(score);
                } 
            } else {
                // unmarshal scores
                let scoresArray = JSON.parse(highscoresStr);
                for(let jsonScore of scoresArray) {
                    let score = new HighScore(jsonScore._name, jsonScore._score, jsonScore._level);                    
                    Global._highscores.push(score);
                };
            }

            // Sort scores into order
            Global._highscores = Global._highscores.sort(sortScores);

        }

        private _saveScores = () => {
            let highscoresStr = JSON.stringify(Global._highscores)
            localStorage.setItem("highscores", highscoresStr);
        }

        private _gotoMenu = () => {
             this.game.state.start("Menu");
        }

        private _letterBack = () => {
            if (this._newLetterIndex > 0) {
                this._newLetterIndex--;
            } else {
             this._newLetterIndex = this._fontStr.length-1;
            }
             this._updateNewName();
        }

        private _letterForward = () => {
            if (this._newLetterIndex < (this._fontStr.length-1)) {
                this._newLetterIndex++;
            } else {
                this._newLetterIndex = 0;
            }
                this._updateNewName();
        }

        private _enterScore = () => {
            let latestScore = new HighScore(this._newName, Global._score, Global._level);
            Global._highscores.push(latestScore);

            Global._highscores = Global._highscores.sort(sortScores);
            Global._highscores = Global._highscores.slice(0,Global.TOTAL_SCORES);

            this._saveScores(); 
            // reset current score
            Global._score = 0;
            Global._level = 0;
            this.game.state.start("HighScores");

        }

        private _letterSelected = () => {
            let selectedLetter = this._fontStr[this._newLetterIndex];
            switch (selectedLetter) {
                case Global.DEL_CHAR:
                    this._newName = this._newName.slice(0, this._newName.length-1);
                    this._updateNewName();               
                    break;
                case Global.END_CHAR:
                    this._enterScore();
                    break;
                default:
                    // select current letter
                    this._newName += this._fontStr[this._newLetterIndex];
                    if (this._newName.length == Global.NAME_LENGTH-1) {
                        this._enterScore();
                    } else {
                        this._updateNewName();               
                    }
            }
        }

        // -------------------------------------------------------------------------
        public update() {
           
        }

        // your got a high score!
        private _newHighScore = () => {
            // text 
            this._fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-@+";
            this._newHighScoreFont = this.game.add.retroFont('chrome-font', 31, 31, this._fontStr, 10, 1, 1);
            this._newHighScoresLabel = this.game.add.image(0,0,this._newHighScoreFont);            
            let newHighScore = "New high score!";
            this._newHighScoreFont.setText(newHighScore,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._newHighScoresLabel.x = this.game.width/2 - this._newHighScoresLabel.width/2;
            this._newHighScoresLabel.y = this.game.height/2 - this._newHighScoresLabel.height/2 - 100; 

            this._newNameFont = this.game.add.retroFont('chrome-font', 31, 31, this._fontStr, 10, 1, 1);
            this._newNameLabel = this.game.add.image(0,0,this._newNameFont);
            this._newNameLabel.tint = 0x00ff00;               
            this._newLetterFont = this.game.add.retroFont('chrome-font', 31, 31, this._fontStr, 10, 1, 1);
            this._newLetterLabel = this.game.add.image(0,0,this._newLetterFont);  
            this._newLetterLabel.tint = 0xff0000;          


            this._newName = "";
            this._newLetterIndex = 0;

            this._updateNewName();
        }

        private _updateNewName = () => {

            if (this._newName == "") {
            this._newNameFont.setText(" ",true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            } else {
            this._newNameFont.setText(this._newName,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            }
            this._newNameLabel.x = this.game.width/2 - this._newNameLabel.width/2;
            this._newNameLabel.y = this.game.height/2 - this._newNameLabel.height/2; 

            this._newLetter = this._fontStr[this._newLetterIndex];
            this._newLetterFont.setText(this._newLetter,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._newLetterLabel.x = this._newNameLabel.x + this._newNameFont.width +  this._newLetterLabel.width;
            this._newLetterLabel.y = this.game.height/2 - this._newLetterLabel.height/2; 
        }

        private _initTable = () => {
          // text 
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-"
            this._highScoresFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._highScoresLabel = this.game.add.image(0,0,this._highScoresFont);            
            // convert list of scores to string to display
            let highScoreStr = "  Name        Level   Score   \n";
            highScoreStr +=    "------------------------------\n";
            for(let i=0; i<Global._highscores.length; i++) {
                let name = padRight(Global._highscores[i].getName(),Global.NAME_LENGTH);
                let level = padLeft(Global._highscores[i].getLevel().toString(),5);
                let score = padLeft(Global._highscores[i].getScore().toString(),10);
                let scoreStr = ` ${name} ${level} ${score} \n\n`;
                highScoreStr += scoreStr;
            }
            this._highScoresFont.setText(highScoreStr,true,0,0,Phaser.RetroFont.ALIGN_CENTER);
            this._highScoresLabel.x = this.game.width/2 - this._highScoresLabel.width/2;
            this._highScoresLabel.y = this.game.height/2 - this._highScoresLabel.height/2 + 100; 
  
           // timers
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this._showMenu, this);

        }

        private _showMenu = () => {
            // only go to menu if game is still on high scores
            if (this.game.state.getCurrentState().key == "HighScores") {
                this.game.state.start("Menu");
            }
        }

    }


    function sortScores(s1: HighScore, s2: HighScore):number {
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

