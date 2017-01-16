namespace Asteroids {

    export class Global {
        // game
        static game: Phaser.Game;

        // game size
        static GAME_WIDTH: number = 1024;
        static GAME_HEIGHT: number = 800;

        // constants
        static TOTAL_LIVES: number = 3;
        static POINTS_PER_HIT: number = 5;
        static MAX_HEALTH: number = 1000;
        static MAX_ASTEROID_VELOCITY: number = 200;
    }
}

// -------------------------------------------------------------------------
window.onload = function () {
    Asteroids.Global.game = new Asteroids.Game();
};
