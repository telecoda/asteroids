/// <reference path="../tsDefinitions/phaser.d.ts" />
class AsteroidGame
{
	game:Phaser.Game;
	// sprites
	background: Phaser.Sprite;
	asteroid: Phaser.Sprite;
	// controls
	leftKey: Phaser.Key;
	rightKey: Phaser.Key;
	constructor()
	{
		this.game = new Phaser.Game( 1024, 800, Phaser.AUTO, 'content', { preload:this.preload, create:this.create, update:this.update, render: this.render} );
	}
	
	preload()
	{
		this.game.load.image( 'background', "assets/stars.png" );
		this.game.load.image( 'asteroid-01', "assets/asteroid-01.png" );
		this.game.stage.backgroundColor = 0x000000;
		this.game.time.advancedTiming = true;
		// setup input
		this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
		this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
	}
	
	create()
	{
		// init game states
		this.background = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'background' );
		this.background.anchor.setTo( 0.5, 0.5 );
		// init asteroids
		this.asteroid = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'asteroid-01' );
		this.asteroid.anchor.setTo( 0.5, 0.5 );
	}

	update()
	{
		if (this.leftKey.isDown) {
			this.asteroid.rotation -= 0.05;
		}
		if (this.rightKey.isDown) {
			this.asteroid.rotation += 0.05;
		}
	}

	render() {
		this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#ffffff");
    }
}

// when the page has finished loading, create our game
window.onload = () => {
	var game = new AsteroidGame();
}