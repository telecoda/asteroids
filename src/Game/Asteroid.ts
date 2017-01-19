namespace Asteroids {

    export class Asteroid extends Phaser.Sprite {

        private _group: Phaser.Group;
        private _size: number;

        private static scales: number[] = [0.10,0.25,0.50,0.75,1];
        private static MIN_SIZE: number = 1;
        private static MAX_SIZE: number = 5;
        // -------------------------------------------------------------------------
        public constructor(game: Phaser.Game, x:number, y:number, size: number) {
            super(game, 0, 0, "asteroid-01");

            // center player sprite horizontally
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            // disable physics for asteroid
            game.physics.arcade.enable(this, false);

            // no gravity
            let body = <Phaser.Physics.Arcade.Body>this.body;
            body.allowGravity = false;
            body.angularVelocity = -100;
            body.maxVelocity.set(200);

            this.x = x;
            this.y = y;
            
            this._setSize(size);
        }

        private _setSize = (size: number) =>{
            if (size>Asteroid.MAX_SIZE) {
                size = Asteroid.MAX_SIZE;
            }

            if (size<Asteroid.MIN_SIZE) {
                size = Asteroid.MIN_SIZE;
            }

            this._size = size;
            var scale = Asteroid.scales[size-1];
            // scale asteroid based on size
            this.scale = new Phaser.Point(scale,scale);
            var cx = (this.width * scale)/2;
            var cy = (this.height * scale)/2;
            // set body size 25% smaller
            var scaledWidth = this.width / scale;
            var scaledHeight = this.height / scale;
            var bodyWidth = scaledWidth * 0.75 ;
            var bodyHeight = scaledHeight * 0.75 ;

            // offset body from upper left x,y coord by 1/8th the width (25% / 2)
            this.body.setSize(bodyWidth, bodyHeight, scaledWidth/8, scaledHeight/8)
        }

        public hitByBullet = ():boolean => {
            // decrease size
            if (this._size > Asteroid.MIN_SIZE) {
                this._setSize(this._size-1);
                // spawn a second asteroid
                var second = new Asteroid(this.game,this.x,this.y,this._size);
                second.setGroup(this._group);
                second.addToGroup();
                second.startMoving();
                return false;
            } else  {
                // destroy it
                this.exists = false;
                return true;
            }
        }

        public setGroup = (group: Phaser.Group) => {
            this._group = group;
        }

        public addToGroup = () => {
            this._group.add(this);
        }

        public startMoving = () => {
            this.body.velocity.x = (Global.MAX_ASTEROID_VELOCITY/2) - (Math.random() * Global.MAX_ASTEROID_VELOCITY);
            this.body.velocity.y = (Global.MAX_ASTEROID_VELOCITY/2) - (Math.random() * Global.MAX_ASTEROID_VELOCITY);
        }
    }
}
