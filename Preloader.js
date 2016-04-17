
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		// Create and set preload bar
		this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		// TILES
		this.load.tilemap('map', 'test_map.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('wall', 'graphics/wall_tile.png');
		this.load.image('back', 'graphics/wall.png');
		this.load.image('ladder', 'graphics/ladder.png');
		this.load.image('door', 'graphics/door.png');

		// IMAGES
		this.load.spritesheet('laser_trap', 'graphics/laser.png', 192, 32, 2);
		this.load.image('player', 'graphics/player_one_frame.png');
		this.load.image('boss', 'graphics/boss.png');
		this.load.image('basic_enemy', 'graphics/basic_enemy.png');
		this.load.image('w_particle', 'graphics/white_particle.png');
		this.load.image('test_bullet', 'graphics/test_bullet.png');
		this.load.image('chicken_bullet', 'graphics/chicken_bullet.png');
		this.load.image('play', 'graphics/play.png');

		// SOUNDS
		this.load.audio('uzi_shoot', ['sounds/Laser_Shoot151.mp3']);
		this.load.audio('pistol_shoot', ['sounds/Laser_Shoot157.mp3']);
		this.load.audio('jump', ['sounds/Jump25.mp3']);
		this.load.audio('laser_activation', ['sounds/laser_activation.mp3']);
		this.load.audio('theme', ['sounds/song.mp3']);
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		// Decode MP3 files
		if (this.cache.isSoundDecoded('uzi_shoot') &&
			this.cache.isSoundDecoded('pistol_shoot') &&
			this.cache.isSoundDecoded('jump') &&
			this.cache.isSoundDecoded('laser_activation') &&
			this.cache.isSoundDecoded('theme')) {

			this.state.start('MainMenu');

		}
	}

};
