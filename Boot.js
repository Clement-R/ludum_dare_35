var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            this.scale.pageAlignHorizontally = true;
        }
    },

    preload: function () {
        this.load.image('preloaderBar', 'graphics/loading_bar.png');
    },

    create: function () {
        this.state.start('Preloader');
    }

};
