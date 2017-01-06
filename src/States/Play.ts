namespace Asteroids {

    export class Play extends Phaser.State {

        private _background: Phaser.Sprite;
        private _spaceship: Phaser.Sprite;
        private _asteroid: Phaser.Sprite;
        private _bullets: Phaser.Sprite[] = [];

        // status
        private _gameOver: boolean = false;

        // input
        private _leftKey: Phaser.Key;
        private _rightKey: Phaser.Key;
        private _thrustKey: Phaser.Key;
        private _fireKey: Phaser.Key;
        private _fireDown: boolean;

		public render() {
			this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#ffffff");
		}

        // -------------------------------------------------------------------------
        public create() {

            // enable fps
            this.game.time.advancedTiming = true;

            // enable physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // init background
			this._background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'stars' );
			this._background.anchor.setTo( 0.5, 0.5 );
			// init asteroids
			this._asteroid = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'asteroid-01' );
			this._asteroid.anchor.setTo( 0.5, 0.5 );
			// init spaceship
			this._spaceship = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'spaceship' );
			this._spaceship.anchor.setTo( 0.5, 0.5 );
            this._spaceship.angle = 0;
            this._spaceship.scale = new Phaser.Point(0.5,0.5);
		    //  and its physics settings
            this.game.physics.enable(this._spaceship, Phaser.Physics.ARCADE);

            this._spaceship.body.drag.set(100);
            this._spaceship.body.maxVelocity.set(200);

			// setup input
			this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			this._thrustKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            this._fireKey.onDown.add(function () {
                this._fireDown = true;
            }, this);

        }

        private _fireBullet() {
            this._fireDown = false;
			var bullet = this.game.add.sprite( this._spaceship.centerX, this._spaceship.centerY, 'bullet' );
			bullet.anchor.setTo( 0.5, 0.5 );
            bullet.angle = this._spaceship.angle;
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
            bullet.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this._spaceship.angle, 300));
            this._bullets.push(bullet);
        }

        // -------------------------------------------------------------------------
        public update() {

            this._handleInput();
            this._wrapShipLocation();

        }

        private _handleInput() {

            if (this._thrustKey.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this._spaceship.rotation, 200, this._spaceship.body.acceleration);
            }
            else {
                this._spaceship.body.acceleration.set(0);
            }

            if (this._leftKey.isDown) {
                this._spaceship.body.angularVelocity = -300;
            }
            else if (this._rightKey.isDown) {
                this._spaceship.body.angularVelocity = 300;
            }
            else {
                this._spaceship.body.angularVelocity = 0;
            }

            if (this._fireDown) {
                this._fireBullet()
            }

        }

        private _wrapShipLocation() {
            // check if ship offscreen , wrap around
            var sx = this._spaceship.x;
            var sy = this._spaceship.y;
            var width = this._spaceship.width / 2;
            var height = this._spaceship.height / 2;

            if (sx+width < 0) {
                // off to left
                this._spaceship.x = Global.GAME_WIDTH+width;
            } else if (sx-width > Global.GAME_WIDTH) {
                // off to right
                this._spaceship.x = -width;
            }
            if (sy+height < 0) {
                // off to the top
                this._spaceship.y = Global.GAME_HEIGHT+height;
            } else if (sy-height > Global.GAME_HEIGHT) {
                // off to the bottom
                this._spaceship.y = -height;
            }
        }
    }
}
