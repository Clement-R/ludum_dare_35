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
        player.body.gravity.y = 700;

        jumpTimer = 0;
        facing = "";
        idle = true;
        nextFire = 0;
        fireRate = 250;

        playerVelocity = 200;

        // Weapon things
        bullets = this.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < 1000; i++) {
            var b = bullets.create(0, 0, 'test_bullet');
            b.name = 'bullet' + i;
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.body.allowGravity = false
            b.events.onOutOfBounds.add(function(bullet) {bullet.kill()}, this);
        }

        // Camera settings
        this.camera.follow(player);

        // Set up controls
        cursors = this.input.keyboard.createCursorKeys();
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        shootButton = this.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    },

    update: function () {
        this.physics.arcade.collide(player, layer);
        this.physics.arcade.collide(bullets, layer, function(bullet) {
            bullet.kill();
        });

        /* MOVE MOVE */
        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -playerVelocity;
            if (facing != 'left') {
                // player.animations.play('left');
                facing = 'left';
            }
            idle = false;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = playerVelocity;

            if (facing != 'right') {
                // player.animations.play('right');
                facing = 'right';
            }
            idle = false;
        } else {
            // if (facing != 'idle') {
            if (!idle) {
                // player.animations.stop();

                if (facing == 'left') {
                    player.frame = 0;
                } else {
                    player.frame = 5;
                }

                idle = true;
            }
        }

        /* JUMP JUMP ! */
        if (jumpButton.isDown && this.time.now > jumpTimer && player.body.velocity.y == 0) {
            player.body.velocity.y = -550;
            jumpTimer = this.time.now + 750;
        }

        /* SHOOT ! */
        if (shootButton.isDown) {
            if (this.time.time >= nextFire) {
                bullet = bullets.getFirstExists(false);
                if (bullet) {
                    if(facing == "right") {
                        bullet.reset(player.x + 32, player.y + 16);
                        bullet.body.velocity.x = 750;
                    } else if (facing == "left") {
                        bullet.reset(player.x - 32, player.y + 16);
                        bullet.body.velocity.x = -750;
                    }
                    nextFire = this.time.time + fireRate;
                }
            }
        }
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        // STOP THE MUSIC

        //  Go back to the main menu
        this.state.start('MainMenu');
    }

};
