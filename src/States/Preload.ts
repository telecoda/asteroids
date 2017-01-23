namespace Asteroids {

    export class Preload extends Phaser.State {

        // music decoded, ready for game
        private _ready: boolean = false;

        // -------------------------------------------------------------------------
        public preload() {
            this.load.image("stars", "assets/stars.png");
            this.load.image("asteroid-01", "assets/asteroid-01.png");
            this.load.image("spaceship", "assets/spaceship.png");
            this.load.image("bullet", "assets/bullet.png")
            this.load.spritesheet("explosion", "assets/explosion_spritesheet.png",128,128,70)
            this.game.load.image('chrome-font', 'assets/fonts/ST_ADM.GIF');

        }

        // -------------------------------------------------------------------------
        public create() {

        }

        // -------------------------------------------------------------------------
        public update() {
            // run only once
            if (this._ready === false) {
                this._ready = true;

                this.game.state.start("Menu");
            }
        }
    }
}
