namespace Asteroids {

    export class Play extends Phaser.State {

        private _background: Phaser.Sprite;
        private _spaceship: Phaser.Sprite;
        private _asteroids: Phaser.Group;
        private _asteroidCount: number = 0;
        private _weapon: Phaser.Weapon;
        private _bullets: Phaser.Sprite[] = [];

        // status
        private _gameOver: boolean = false;

        private _lives: number = 0;
        private _score: number = 0;
        private _level: number = 0;

        // input
        private _leftKey: Phaser.Key;
        private _rightKey: Phaser.Key;
        private _thrustKey: Phaser.Key;
        private _fireKey: Phaser.Key;
        
		public render() {
			this.game.debug.text("fps:" + this.game.time.fps.toString(), 2, 14, "#ffffff");
			this.game.debug.text("Score:" + this._score, 100, 14, "#ffffff");
			this.game.debug.text("Lives:" + this._lives, 200, 14, "#ffffff");
			this.game.debug.text("Level:" + this._level, 300, 14, "#ffffff");
			this.game.debug.text("Left:" + this._asteroidCount, 400, 14, "#ffffff");
            this._weapon.debug();
            this._asteroids.forEachExists(function (sprite: Phaser.Sprite) {
                this.game.debug.body(sprite);
            }, this);
            
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
			// init spaceship
			this._spaceship = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'spaceship' );
			this._spaceship.anchor.setTo( 0.5, 0.5 );
            this._spaceship.angle = 0;
            this._spaceship.scale = new Phaser.Point(0.5,0.5);
		    //  and its physics settings
            this.game.physics.enable(this._spaceship, Phaser.Physics.ARCADE);

            this._spaceship.body.drag.set(100);
            this._spaceship.body.maxVelocity.set(200);

            this._weapon = this.game.add.weapon(30, 'bullet');
            this._weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

            this._weapon.bulletSpeed = 300;
            this._weapon.fireRate = 100;
            this._weapon.trackSprite(this._spaceship, 0, 0, true);


			// setup input
			this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			this._thrustKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            this._startGame();
            this._initAsteroids(this._asteroidCount);

        }

        // -------------------------------------------------------------------------
        public update() {

            this._handleInput();
            this._wrapShipLocation();

            //  Collision detection
            
            this.game.physics.arcade.overlap(this._weapon.bullets, this._asteroids, this._bulletHitAsteroid, null, this);
 
        }

        private _initAsteroids = (count: number) => {
            this._asteroids = new Phaser.Group(this.game);
            for (var i = 0; i< count; i++) {
                var x = this.game.world.centerX-200;
                var y = this.game.world.centerY-300+i*100;
                var asteroid = new Asteroids.Asteroid(this.game ,x ,y );
                this._asteroids.add(asteroid);
            }

        }

        private _startGame() {
            this._lives = Global.TOTAL_LIVES;
            this._score = 0;
            this._level = 1;
            this._asteroidCount = 5;
        }

        private _bulletHitAsteroid = (asteroid: Phaser.Bullet, bullet: Phaser.Bullet) => {
            // we can't kill/destroy the asteroid here as it messes up the underlying array an we'll
            // get undefined errors as we try to reference deleted objects.
            asteroid.visible = false;
            bullet.kill();
            this._asteroidCount--;
            this._score += Global.POINTS_PER_HIT;

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

            if (this._fireKey.isDown) {
                this._weapon.fire()
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
