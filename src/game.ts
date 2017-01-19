/// <reference path="../tsDefinitions/phaser.d.ts" />
namespace Asteroids {

    export class Game extends Phaser.Game {
		 public constructor() {
            // init game
            super(Global.GAME_WIDTH, Global.GAME_HEIGHT, Phaser.AUTO, "content");

            // states
            this.state.add("Boot", Boot);
            this.state.add("Preload", Preload);
            this.state.add("Menu", Menu);
            this.state.add("Play", Play);
            this.state.add("GameOver", GameOver);

            // start
            this.state.start("Boot");
        }
	}
}