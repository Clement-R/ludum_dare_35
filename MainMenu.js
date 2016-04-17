
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {
		/*this.music = this.add.audio('mainMenuTheme', 1, true);
		this.music.play();*/

		this.playButton = this.add.sprite(100, 30, 'play');
		this.playButton.inputEnabled = true;
		this.playButton.events.onInputDown.add(this.startGame, this);

		var style = { font: "25px Arial", fill: "#ffffaa"};
    	var text1 = this.game.add.text(10, 250, "Go kick some bad guys with your shapeshifting gun !", style);

		var style = { font: "15px Arial", fill: "#ffffff"};
    	var text1 = this.game.add.text(100, 290, "Arrows : Movement", style);
    	var text1 = this.game.add.text(100, 315, "CTRL : Shoot", style);
    	var text1 = this.game.add.text(100, 340, "SPACE : Jump", style);
    	var text1 = this.game.add.text(100, 365, "SHIFT : Slow motion (useless but fun !)", style);
	},

	startGame: function () {
		this.state.start('Game');
	}

};
