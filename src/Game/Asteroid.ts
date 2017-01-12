namespace Asteroids {

    export class Asteroid extends Phaser.Sprite {

        // -------------------------------------------------------------------------
        public constructor(game: Phaser.Game, x:number, y:number) {
            super(game, 0, 0, "Asteroid");

            // center player sprite horizontally
            this.anchor.x = 0.5;
            this.loadTexture('asteroid-01');
            // enable physics for asteroid
            game.physics.arcade.enable(this, false);

            // no gravity
            let body = <Phaser.Physics.Arcade.Body>this.body;
            body.allowGravity = false;
            body.setSize(this.width-50, this.height-50, 25, 25)

            this.x = x;
            this.y = y;
        }
    }
}
