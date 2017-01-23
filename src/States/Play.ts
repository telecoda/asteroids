namespace Asteroids {

    export class Play extends Phaser.State {

        static LEVEL_START: number = 1;
        static PLAYING: number = 2;
        static LEVEL_END: number = 3;
        static PLAYER_DIED: number = 4;
        static GAME_COMPLETED: number = 5;
        static PAUSED: number = 6;

        private _background: Phaser.Sprite;
        private _spaceship: Phaser.Sprite;
        private _asteroids: Phaser.Group;
        private _explosions: Phaser.Group;
        private _hud: Phaser.Group;
        private _asteroidCount: number = 0;
        private _weapon: Phaser.Weapon;
        private _bullets: Phaser.Sprite[] = [];
        private _healthBar: Phaser.Graphics;
        // text
        private _statusText: Phaser.Text;
        private _levelFont: Phaser.RetroFont;
        private _scoreFont: Phaser.RetroFont;
        private _livesFont: Phaser.RetroFont;
        private _levelLabel: Phaser.Image;
        private _scoreLabel: Phaser.Image;
        private _livesLabel: Phaser.Image;

        // animations
        private _explosion: Phaser.Animation;


        // state
        private _state: number;

        // input
        private _leftKey: Phaser.Key;
        private _rightKey: Phaser.Key;
        private _thrustKey: Phaser.Key;
        private _fireKey: Phaser.Key;
        private _pauseKey: Phaser.Key;

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

            this._weapon = this.game.add.weapon(Global.MAX_BULLETS, 'bullet');
            this._weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

            this._weapon.bulletSpeed = Global.BULLET_SPEED;
            this._weapon.fireRate = Global.FIRE_RATE;
            this._weapon.trackSprite(this._spaceship, 0, 0, true);

            // text overlays
            var statusTextStyle = { font: "72px Arial", fill: "#ffffff", align: "center" };
            this._statusText = this.game.add.text(0,0, "", statusTextStyle )
            // hud 
            this._hud = new Phaser.Group(this.game);
            var fontStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .0123456789!(),'?:-"
            this._scoreFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._scoreLabel = this.game.add.image(0,0,this._scoreFont);
            this._levelFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._levelLabel = this.game.add.image(0,0,this._levelFont);
            this._livesFont = this.game.add.retroFont('chrome-font', 31, 31, fontStr, 10, 1, 1);
            this._livesLabel = this.game.add.image(0,0,this._livesFont);
            // healthbar
            this._healthBar = this.game.add.graphics(0,0);
            this._updateHealthBar();

            this._hud.add(this._scoreLabel);
            this._hud.add(this._levelLabel);
            this._hud.add(this._livesLabel);
            this._hud.add(this._healthBar);

			// setup input
			this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			this._thrustKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this._fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this._pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);

            this._pauseKey.onDown.add(this._pauseToggle, this);

            // animations
            this._explosions = new Phaser.Group(this.game);
            
            this._startNewGame();

        }

        // -------------------------------------------------------------------------
        public update() {

            switch(this._state) {
                case Play.PLAYING: {
                    // check for level complete
                    if (this._asteroidCount == 0) {
                        this._levelCompleted();
                        break;
                    }

                    if (this._spaceship.health <= 0) {
                        this._playerDied();
                    }
                    this._handleInput();
                    this._wrapLocation(this._spaceship);
                    this._asteroids.forEachExists(function (sprite: Phaser.Sprite) {
                        this._wrapLocation(sprite);
                    }, this);

                    //  Collision detection
                    this.game.physics.arcade.overlap(this._weapon.bullets, this._asteroids, this._bulletHitAsteroid, null, this);
                    this.game.physics.arcade.overlap(this._spaceship, this._asteroids, this._spaceshipHitAsteroid, null, this);
                    // update health display
                    // health remaining
                    this._updateHealthBar();    
                    break;
                }
            }
        }

        private _updateHealthBar = () => {
            this._healthBar.x = this.game.width/2 - Global.HEALTHBAR_WIDTH/2; 
            this._healthBar.y = this.game.height - Global.HEALTHBAR_HEIGHT - Global.HUD_BORDER;
            this._healthBar.clear();
            // draw green
            this._healthBar.beginFill(0x00ff00);
            var healthEnd = this._spaceship.health * (Global.HEALTHBAR_WIDTH/Global.MAX_HEALTH);
            this._healthBar.drawRect(0, 0, healthEnd, Global.HEALTHBAR_HEIGHT);
            this._healthBar.endFill();
        
            // draw red
            this._healthBar.beginFill(0xff0000);
            this._healthBar.drawRect(healthEnd, 0, Global.HEALTHBAR_WIDTH-healthEnd, Global.HEALTHBAR_HEIGHT);
            this._healthBar.endFill();
        }
        
		public render() {
			this.game.debug.text("fps:" + this.game.time.fps.toString(), 2, 80, "#ffffff");
			// this.game.debug.text("Score:" + Global._score, 100, 80, "#ffffff");
			// this.game.debug.text("Health:" + this._spaceship.health, 200, 80, "#ffffff");
			// this.game.debug.text("Lives:" + Global._lives, 300, 80, "#ffffff");
			// this.game.debug.text("Level:" + Global._level, 400, 80, "#ffffff");
			// this.game.debug.text("Left:" + this._asteroidCount, 500, 80, "#ffffff");
            // this._weapon.debug();
  		}

        private _startNewGame = () => {
            this._setStatus("Start level 1");
            this._state = Play.LEVEL_START;
            Global._lives = Global.TOTAL_LIVES;
            Global._score = 0;
            Global._level = 1;
            this._increaseScore(0); // init score label
            this._resetPlayer(Global.MAX_HEALTH);
            this._updateHealthBar();
            this._updateLivesText();
            this._startLevel();
        }

        private _startLevel = () => {
            this._setStatus("Starting level " + Global._level);
            this._state = Play.LEVEL_START;
            this._levelFont.setText("Level:"+ Global._level);
            this._levelLabel.y = Global.HUD_Y;
            this._levelLabel.x = Global.HUD_BORDER;
            this._asteroidCount = Global._level * Global.ASTEROID_MULTIPLIER;
            this._initAsteroids(this._asteroidCount);
            //  Wait 2 seconds then start level
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this._startPlaying, this);
        }

        private _startNextLevel = () => {
            this._setStatus("");
            if (Global._level < Global.TOTAL_LEVELS) {
                Global._level++;
                this._resetPlayer(this._spaceship.health); // reset play but dont change health
                this._startLevel();
            } else {
                // game complete!
                this._gameCompleted();
            }
        }

        private _levelCompleted = () => {
            this._setStatus("Level " + Global._level + " complete");
            this._state = Play.LEVEL_END;
            //  Wait 2 seconds then start a next level
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this._startNextLevel, this);
        }

        private _gameCompleted = () => {
            this._setStatus("Congratulations - Game Complete!");
            this._state = Play.GAME_COMPLETED;
        }

        private _gameOver = () => {
            this.game.state.start("GameOver");
        }

        private _startPlaying = () => {
            this._hideStatus();
            this._state = Play.PLAYING;
        }

        private _resetPlayer = (health: number) => {
            this._spaceship.health = health;
            this._spaceship.body.drag.set(Global.SHIP_DRAG);
            this._spaceship.body.maxVelocity.set(Global.SHIP_MAX_VELOCITY);
            this._spaceship.angle = 0;
            this._spaceship.x = this.game.world.centerX;
            this._spaceship.y = this.game.world.centerY
        }

        private _resumePlaying = () => {
            this._setStatus("Keep going...");
            this._state = Play.LEVEL_START;
            //  Wait 2 seconds then start level
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this._startPlaying, this);
        }

        private _playerDied = () => {
            this._state = Play.PLAYER_DIED;
            Global._lives--;
            this._updateLivesText();
            if (Global._lives < 1) {
                this._gameOver();
                return;
            }
            this._resetPlayer(Global.MAX_HEALTH);
            this._resumePlaying();
        }

        private _pauseToggle = () => {
            this.game.paused = !this.game.paused;
        }

        private _setStatus = (text: string) => {
            this._statusText.setText(text);
            this._statusText.x = this.game.width/2 - this._statusText.width/2;
            this._statusText.y = this.game.height/2 - this._statusText.height/2; 
            this._statusText.visible = true;
        } 

        private _hideStatus = () => {
            this._statusText.visible = false;
        }

        private _initAsteroids = (count: number) => {
            this._asteroids = new Phaser.Group(this.game);
            for (var i = 0; i< count; i++) {
                var x = this.game.width * Math.random();
                var y = -50;
                var asteroid = new Asteroids.Asteroid(this.game ,x ,y, 5);
                asteroid.setGroup(this._asteroids)
                asteroid.addToGroup();
                asteroid.startMoving();
            }
        }

        private _bulletHitAsteroid = (bullet: Phaser.Bullet,asteroid: Asteroids.Asteroid ) => {
            // we can't kill/destroy the asteroid here as it messes up the underlying array an we'll
            // get undefined errors as we try to reference deleted objects.
            bullet.kill();
            var destroyed = asteroid.hitByBullet();
            if (destroyed) {
                this._asteroidCount--;
            } else {
                // increase count as asteroid has split in two
                this._asteroidCount++;
            }
            this._increaseScore(Global.POINTS_PER_HIT);
            // create explosion
            this._createExplosionAt(bullet.x,bullet.y);
        }

        private _updateLivesText = () => {
            this._livesFont.setText("Lives:"+ Global._lives);
            this._livesLabel.y = Global.HUD_Y;
            this._livesLabel.x = this.game.width - this._livesLabel.width - Global.HUD_BORDER;
        }

        private _increaseScore = (inc: number) => {
            Global._score += inc;
            this._scoreFont.setText("Score:"+ Global._score);
            this._scoreLabel.y = Global.HUD_Y;
            this._scoreLabel.x = this.game.width/2 - this._scoreLabel.width/2;
        }

        private _createExplosionAt = (x: number, y:number) => {
            var explosion = new Phaser.Sprite(this.game, x, y);
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.loadTexture("explosion",0);
            explosion.animations.add("boom");
            explosion.animations.play("boom",10,false,true);
            this._explosions.add(explosion);

        }

        private _spaceshipHitAsteroid = (spaceship: Phaser.Sprite,asteroid: Asteroids.Asteroid ) => {
            spaceship.health -= Global.ASTEROID_DAMAGE;
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

        private _wrapLocation(sprite: Phaser.Sprite) {
            // check if ship offscreen , wrap around
            var sx = sprite.x;
            var sy = sprite.y;
            var width = sprite.width / 2;
            var height = sprite.height / 2;

            if (sx+width < 0) {
                // off to left
                sprite.x = Global.GAME_WIDTH+width;
            } else if (sx-width > Global.GAME_WIDTH) {
                // off to right
                sprite.x = -width;
            }
            if (sy+height < 0) {
                // off to the top
                sprite.y = Global.GAME_HEIGHT+height;
            } else if (sy-height > Global.GAME_HEIGHT) {
                // off to the bottom
                sprite.y = -height;
            }
        }
 
    }
}
