namespace Asteroids {

    export class Preload extends Phaser.State {

        // music decoded, ready for game
        private _ready: boolean = false;

        // -------------------------------------------------------------------------
        public preload() {
            // images
            this.load.image("stars", "assets/stars.png");
            this.load.image("asteroid-01", "assets/asteroid-01.png");
            this.load.image("spaceship", "assets/spaceship.png");
            this.load.image("spaceship-hit", "assets/spaceship-hit.png");
            this.load.image("bullet", "assets/bullet.png")
            this.load.image("enemy", "assets/enemy.png");
            this.load.image("enemy-bullet", "assets/enemy-bullet.png");
            this.load.spritesheet("explosion", "assets/explosion_spritesheet.png",128,128,70)
            this.load.image("thruster","assets/particles/red.png");
            this.game.load.image('chrome-font', 'assets/fonts/ST_ADM.GIF');
            this.game.load.image('16x16-font', 'assets/fonts/16x16-cool-metal.png');
            this.game.load.image('260-font', 'assets/fonts/260.png');
            // audio
            this.game.load.audio('music', 'assets/audio/TheLoomingBattle.ogg');
            this.game.load.audio('explosion-1', 'assets/audio/Explosion10.ogg');
            this.game.load.audio('explosion-2', 'assets/audio/Explosion18.ogg');
            this.game.load.audio('explosion-3', 'assets/audio/Explosion20.ogg');
            this.game.load.audio('hyperspace', 'assets/audio/Jump3.ogg');
            this.game.load.audio('laser-1', 'assets/audio/Laser_Shoot.ogg');
            this.game.load.audio('laser-2', 'assets/audio/Laser_Shoot5.ogg');
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
