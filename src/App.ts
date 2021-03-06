namespace Asteroids {

    export class Global {
        // game
        static game: Phaser.Game;

        // game size
        static GAME_WIDTH: number = 1024;
        static GAME_HEIGHT: number = 800;

        // constants
        static TOTAL_LIVES: number = 3;
        static TOTAL_LEVELS: number = 10;
        static POINTS_ASTEROID_PER_HIT: number = 50;
        static POINTS_PER_ENEMY_HIT: number = 500;
        static EXTRA_LIFE_EVERY: number = 10000;
        static HUD_Y: number = 20;
        static HUD_BORDER: number = 20;
        static HEALTHBAR_HEIGHT: number = 10;
        static HEALTHBAR_WIDTH: number = 800;
        // ship
        static SHIP_DRAG : number = 100;
        static SHIP_MAX_VELOCITY: number = 300;
        static MAX_HEALTH: number = 1000;
        // asteroids
        static ASTEROID_MULTIPLIER: number = 2; // level * this = total asteroids
        static ASTEROID_DAMAGE: number = 1;
        static MAX_ASTEROID_VELOCITY: number = 200;
        // enemies
        static ENEMY_BULLET_DAMAGE: number = 5;
        static ENEMY_DAMAGE: number = 10;
        static MAX_ENEMY_VELOCITY: number = 200;
        static ENEMY_TIMER: number = 20; // number of seconds till new enemy appeaars
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

        // high score table
        static TOTAL_SCORES: number = 10;
        static NAME_LENGTH: number = 10;
        static DEL_CHAR: string = "@";
        static END_CHAR: string = "+";
        static _highscores : Array<HighScore>;

    }
}

// -------------------------------------------------------------------------
window.onload = function () {
    Asteroids.Global.game = new Asteroids.Game();
};
