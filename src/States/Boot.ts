namespace Asteroids {

    export class Boot extends Phaser.State {
 
        // -------------------------------------------------------------------------
        public create() {

            Global._score = 0;
            Global._level = 0;
            this.game.state.start("Preload");

        }
    }

}
