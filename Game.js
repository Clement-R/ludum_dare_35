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
        this.stage.backgroundColor = "#2b87c4"

        // Set up game physic engine
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 350;

        // Create map
        var map = this.add.tilemap("map");
        map.addTilesetImage("wall");

        layer = map.createLayer("Calque de Tile 1");
        outer = map.createLayer("outer");
        house = map.createLayer("house");

        map.setCollisionBetween(1, 1, true, "Calque de Tile 1");
        map.setCollisionBetween(1, 1, true, "outer");

        layer.resizeWorld();

        // Set up player
        player = this.add.sprite(33 * 32, 12 * 32, "player");

        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 700;

        jumpTimer = 0;
        facing = "";
        idle = true;
        nextFire = 0;

        jumpSound = this.game.add.audio('jump');
        jumpSound.volume = 0.5;

        playerVelocity = 200;

        // Set up enemy
        enemies = this.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.createEnemy(200, 150);
        this.createEnemy(240, 150);
        this.createEnemy(400, 150);

        // Weapon things
        bullets = this.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < 5000; i++) {
            var b = bullets.create(0, 0, 'chicken_bullet');
            b.name = 'bullet' + i;
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.body.allowGravity = false
            b.events.onOutOfBounds.add(function(bullet) {bullet.kill()}, this);
        }

        /* Weapons sounds */
        pistolSound = this.game.add.audio('pistol_shoot');
        pistolSound.volume = 0.5;

        uziSound = this.game.add.audio('uzi_shoot');
        uziSound.volume = 0.5;

        // Gogo weapons !
        weaponTypes = ["pistol", "uzi"];
        weapons = {
            "pistol": {
                fireRate: 500,
                sound: pistolSound
            },
            "uzi": {
                fireRate: 100,
                sound: uziSound
            }
        }

        bulletType = weaponTypes[0];
        fireRate = weapons[bulletType].fireRate;
        currentWeaponSound = weapons[bulletType].sound;

        // Weapon random changer
        timer = this.time.create(false);
        timer.loop(5000, function(){
            bulletType = weaponTypes[Math.floor(Math.random()*weaponTypes.length)];
            fireRate = weapons[bulletType].fireRate;
            currentWeaponSound = weapons[bulletType].sound;
            nextFire = 0;
        }, this);
        timer.start();

        // Camera settings
        this.camera.follow(player);

        // Set up controls
        cursors = this.input.keyboard.createCursorKeys();
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        shootButton = this.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    },

    createEnemy: function(x, y) {
        var enemy_texture = this.add.bitmapData(32, 64);
        enemy_texture.ctx.beginPath();
        enemy_texture.ctx.rect(0,0,32,64);
        enemy_texture.ctx.fillStyle = '#27ae60';
        enemy_texture.ctx.fill();

        enemy = enemies.create(x, y, enemy_texture);
        enemy.health = 3;
        enemy.body.gravity.y = 700;
        enemy.velocity = -100;
        enemy.body.velocity.x = enemy.velocity;
        enemy.body.immovable = true;

        enemy.changeDirection = function() {
            this.velocity = this.velocity * -1;
            this.body.velocity.x = this.velocity;
        };
    },

    update: function () {
        this.physics.arcade.collide(player, layer);
        this.physics.arcade.collide(player, outer);

        this.physics.arcade.collide(enemies, layer);
        this.physics.arcade.collide(enemies, outer, function(enemy, wall){
            enemy.changeDirection();
        });

        this.physics.arcade.collide(bullets, layer, function(bullet) {
            bullet.kill();
        });

        this.physics.arcade.collide(bullets, outer, function(bullet) {
            bullet.kill();
        });

        this.physics.arcade.collide(player, enemies);

        this.physics.arcade.overlap(enemies, bullets, function(enemy, bullet){
            enemy.damage(1);
            bullet.kill();
        });

        /* Enemy basic AI */
        enemies.forEach(function(enemy){
            var distance = Math.sqrt(Math.pow((player.x - enemy.x), 2) + Math.pow((player.y - enemy.y), 2));
            if(distance < 250 - this.rnd.integerInRange(-40, 40)) {
                enemy.body.velocity = 0;
            }
            // enemy
        }.bind(this));

        /* MOVE MOVE */
        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -playerVelocity;
            if (facing != 'left') {
                // player.animations.play('left');
                facing = 'left';
                player.scale.x = 1;
            }
            idle = false;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = playerVelocity;

            if (facing != 'right') {
                // player.animations.play('right');
                facing = 'right';
                player.scale.x = -1;
            }
            idle = false;
        } else {
            /*
            // if (facing != 'idle') {
            if (!idle) {
                // player.animations.stop();

                if (facing == 'left') {
                    // player.frame = 0;
                    player.scale.x = 1;
                } else {
                    // player.frame = 5;
                    player.scale.x = -1;
                }

                idle = true;
            }
            */
        }

        /* JUMP JUMP ! */
        if (jumpButton.isDown && this.time.now > jumpTimer && player.body.velocity.y == 0) {
            player.body.velocity.y = -550;
            jumpTimer = this.time.now + 750;
            jumpSound.play();
        }

        /* SHOOT ! */
        if (shootButton.isDown) {
            if (this.time.time >= nextFire) {
                bullet = bullets.getFirstExists(false);
                if (bullet) {
                    currentWeaponSound.play();
                    var rangeCircle = this.game.add.graphics(0, 0);
                    rangeCircle.x = 0;
                    rangeCircle.y = 0;

                    rangeCircle.lineStyle(0);
                    rangeCircle.beginFill(0xFFFFFF);

                    if(facing == "right") {
                        bullet.reset(player.x, player.y);
                        rangeCircle.drawCircle(player.x,
                                               player.y + 26,
                                               20);
                    } else if (facing == "left") {
                        bullet.reset(player.x - 25, player.y);
                        rangeCircle.drawCircle(player.x,
                                               player.y + 26,
                                               20);
                    }

                    rangeCircle.endFill();

                    if(bulletType == "pistol") {
                        var velocity = 750;
                        bullet.angle = 0;
                    } else if (bulletType == "uzi") {
                        var velocity = 950;
                        bullet.angle = 0;
                        bullet.angle += this.rnd.integerInRange(-3, 3);
                    }


                    if(facing == "right") {
                        this.physics.arcade.accelerationFromRotation(bullet.rotation,
                                                                     velocity,
                                                                     bullet.body.velocity);

                        // bullet.body.velocity.x = velocity;
                    } else if (facing == "left") {
                        // bullet.body.velocity.x = -velocity;
                        this.physics.arcade.accelerationFromRotation(bullet.rotation,
                                                                     -velocity,
                                                                     bullet.body.velocity);
                    }

                    nextFire = this.time.time + fireRate;
                    this.time.events.add(Phaser.Timer.SECOND * 0.05, function(){
                        rangeCircle.clear();
                    }, this);

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
