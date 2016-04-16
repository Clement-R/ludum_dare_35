
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		// Create and set preload bar
		/*this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		// Sprites and animations
		this.load.image('player', 'character.png');
		this.load.image('smallEnemy', 'small_enemy_2.png');
		this.load.image('playerShot', 'player_shot.png');
		this.load.image('background', 'background.png');
		this.load.image('enemyShot', 'enemy_shot.png');
		this.load.image('healthBar', 'health.png');

		// Audio effects
		this.load.audio('playerShootSound', ['Laser_Shoot49.mp3']);
		this.load.audio('mainTheme', ['Venus.mp3']);

		// Main menu audio effects
		this.load.audio('jingle', ['intro.mp3']);
		this.load.audio('mainMenuTheme', ['main_menu.mp3']);
		this.load.image('play', 'play.png');*/
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		// Decode MP3 files
		/*if (this.cache.isSoundDecoded('playerShootSound') &&
			this.cache.isSoundDecoded('mainTheme') &&
			this.cache.isSoundDecoded('jingle') &&
			this.cache.isSoundDecoded('mainMenuTheme') &&
			this.ready == false) {

			this.ready = true;
			this.music = this.add.audio('jingle');
			this.music.play();
			this.music.onStop.addOnce(function(){
				this.state.start('MainMenu');
			}, this);

		}*/
		this.state.start('MainMenu');
	}

};
