namespace Asteroids {

    export class Global {
        // game
        static game: Phaser.Game;

        // game size
        static GAME_WIDTH: number = 1024;
        static GAME_HEIGHT: number = 800;

        // constants
        static TOTAL_LIVES: number = 3;
        static TOTAL_LEVELS: number = 3;
        static POINTS_PER_HIT: number = 5;
        static HUD_Y: number = 20;
        static HUD_BORDER: number = 20;
        static HEALTHBAR_HEIGHT: number = 10;
        static HEALTHBAR_WIDTH: number = 800;
        // ship
        static SHIP_DRAG : number = 100;
        static SHIP_MAX_VELOCITY: number = 200;
        static MAX_HEALTH: number = 1000;
        // asteroids
        static ASTEROID_MULTIPLIER: number = 1;
        static ASTEROID_DAMAGE: number = 10;
        static MAX_ASTEROID_VELOCITY: number = 200;
        // weapon
        static BULLET_SPEED : number = 300;
        static FIRE_RATE : number = 100;
        static MAX_BULLETS: number = 30
        // particles
        static MAX_PARTICLES: number = 1000;

        // share game variables
        static _lives : number;
        static _level : number;
        static _score : number;

    }
}

// -------------------------------------------------------------------------
window.onload = function () {
    Asteroids.Global.game = new Asteroids.Game();
};
