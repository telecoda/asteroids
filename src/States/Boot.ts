namespace Asteroids {

    export class Boot extends Phaser.State {
 
        // -------------------------------------------------------------------------
        public create() {

            // init high score table
            Global._highscores = new Array<HighScore>();
            for (let i=0; i< Global.TOTAL_SCORES; i++) {
                let score = new HighScore("name"+i, i*1000,i);
                Global._highscores.push(score);
            }

            // Sort scores into order
            Global._highscores = Global._highscores.sort(sortScores);

            
            Global._score = 0;
            Global._level = 0;
            this.game.state.start("Preload");

        }
    }

}
