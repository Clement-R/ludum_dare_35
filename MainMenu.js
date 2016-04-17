
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {
		/*this.music = this.add.audio('mainMenuTheme', 1, true);
		this.music.play();

		this.playButton = this.add.sprite(200, 100, 'play');
		this.playButton.inputEnabled = true;
		this.playButton.events.onInputDown.add(this.startGame, this);*/
	},

	update: function () {
		// TEMP
		this.state.start('Game');
	},

	startGame: function () {
		// this.music.stop();
		// this.state.start('Game');

	}

};
