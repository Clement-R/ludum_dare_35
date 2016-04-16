BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.speed = 300;
    this.weapons = [];
    this.player = null;
    this.enemies = null;
;};

BasicGame.Game.prototype = {
    create: function () {
        // Set up game physic engine
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 350;

        // Create map
        var map = this.add.tilemap("map");
        map.addTilesetImage("wall");
        layer = map.createLayer("Calque de Tile 1");
        map.setCollisionBetween(1, 10000, true, "Calque de Tile 1");
        layer.resizeWorld();

        // Set up player
        var player_texture = this.add.bitmapData(32, 32);
        player_texture.ctx.beginPath();
        player_texture.ctx.rect(0,0,32,32);
        player_texture.ctx.fillStyle = '#0000ff';
        player_texture.ctx.fill();

        player = this.add.sprite(100, 1216, player_texture);
        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        cursors = this.input.keyboard.createCursorKeys();
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpTimer = 0;
        facing = "";

        // Camera settings
        this.camera.follow(player);
    },

    update: function () {
        this.physics.arcade.collide(player, layer);

        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;

            if (facing != 'left')
            {
                // player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;

            if (facing != 'right')
            {
                // player.animations.play('right');
                facing = 'right';
            }
        }
        else
        {
            if (facing != 'idle')
            {
                // player.animations.stop();

                if (facing == 'left')
                {
                    player.frame = 0;
                }
                else
                {
                    player.frame = 5;
                }

                facing = 'idle';
            }
        }

        if (jumpButton.isDown && this.time.now > jumpTimer && player.body.velocity.y == 0)
        {
            player.body.velocity.y = -300;
            jumpTimer = this.time.now + 750;
        }

        console.log(player.x);
        console.log(player.y);
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        // STOP THE MUSIC

        //  Go back to the main menu
        this.state.start('MainMenu');
    }

};
