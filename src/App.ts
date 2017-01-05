namespace Asteroids {

    export class Global {
        // game
        static game: Phaser.Game;

        // game size
        static GAME_WIDTH: number = 1024;
        static GAME_HEIGHT: number = 800;
    }
}

// -------------------------------------------------------------------------
window.onload = function () {
    Asteroids.Global.game = new Asteroids.Game();
};
