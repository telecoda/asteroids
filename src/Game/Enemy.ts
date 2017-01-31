namespace Asteroids {

    export class Enemy extends Phaser.Sprite {

        private _group: Phaser.Group;
        private _size: number;

        public weapon: Phaser.Weapon;
        private _fireDelay: number;
        private _isFiring: boolean;
        private _spaceship: Phaser.Sprite;


        // -------------------------------------------------------------------------
        public constructor(game: Phaser.Game, x:number, y:number, spaceship: Phaser.Sprite, fireDelay: number) {
            super(game, 0, 0, "enemy");

            this._spaceship = spaceship;
            this._fireDelay = fireDelay;

            // center enemy sprite horizontally
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            // disable physics for asteroid
            game.physics.arcade.enable(this, false);

            // no gravity
            let body = <Phaser.Physics.Arcade.Body>this.body;
            body.allowGravity = false;
            body.angularVelocity = -100;
            body.maxVelocity.set(200);

            var bodyWidth = this.width * 0.75 ;
            var bodyHeight = this.height * 0.75 ;

            // offset body from upper left x,y coord by 1/8th the width (25% / 2)
            this.body.setSize(bodyWidth, bodyHeight, this.width/4, this.height/4);

            this.weapon = this.game.add.weapon(Global.MAX_BULLETS, 'enemy-bullet');
            this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

            this.weapon.bulletSpeed = Global.BULLET_SPEED;
            this.weapon.fireRate = Global.FIRE_RATE;
            this.weapon.trackSprite(this, 0, 0, true);
            this._isFiring = true;
            this.game.time.events.add(Phaser.Timer.SECOND * this._fireDelay, this._fireWeapon, this);

            this.x = x;
            this.y = y;
            
        }

        private _fireWeapon = () => {
            if (this._isFiring && this.game) {
                this.weapon.fireAtSprite(this._spaceship);
                this.game.time.events.add(Phaser.Timer.SECOND * this._fireDelay, this._fireWeapon, this);
            }
        }

        public hitByBullet = ():boolean => {
            // destroy it
            this.exists = false;
            this._isFiring = false;
            return true;
        }

        public setGroup = (group: Phaser.Group) => {
            this._group = group;
        }

        public addToGroup = () => {
            this._group.add(this);
        }

        public startMoving = () => {
            this.body.velocity.x = (Global.MAX_ENEMY_VELOCITY/2) - (Math.random() * Global.MAX_ENEMY_VELOCITY);
            this.body.velocity.y = (Global.MAX_ENEMY_VELOCITY/2) - (Math.random() * Global.MAX_ENEMY_VELOCITY);
        }
    }
}
