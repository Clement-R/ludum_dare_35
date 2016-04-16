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
        this.map = this.add.tilemap("map");
        this.map.addTilesetImage("wall");

        this.layer = this.map.createLayer("Calque de Tile 1");
        this.outer = this.map.createLayer("outer");
        this.house = this.map.createLayer("house");
        this.map.setCollisionBetween(1, 1, true, "Calque de Tile 1");
        this.map.setCollisionBetween(1, 1, true, "outer");
        this.layer.resizeWorld();

        // Create player and add physic body and collision with world bounds
        this.player = new Player(this);
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.setPhysic();

        /*
        player = this.add.sprite(33 * 32, 12 * 32, "player");

        this.physics.enable(player, Phaser.Physics.ARCADE);
        */

        this.jumpSound = this.game.add.audio('jump');
        this.jumpSound.volume = 0.5;

        // Set up enemy
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.createEnemy(200, 100);
        this.createEnemy(240, 100);
        this.createEnemy(400, 100);

        // Weapon things
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < 1000; i++) {
            var b = this.bullets.create(0, 0, 'chicken_bullet');
            b.name = 'bullet' + i;
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.body.allowGravity = false
            b.events.onOutOfBounds.add(function(bullet) {bullet.kill()}, this);
        }

        /* Weapons sounds */
        this.pistolSound = this.game.add.audio('pistol_shoot');
        this.pistolSound.volume = 0.5;

        this.uziSound = this.game.add.audio('uzi_shoot');
        this.uziSound.volume = 0.5;

        // Gogo weapons !
        this.weaponTypes = ["pistol", "uzi"];
        this.weapons = {
            "pistol": {
                fireRate: 500,
                sound: this.pistolSound
            },
            "uzi": {
                fireRate: 100,
                sound: this.uziSound
            }
        }

        this.bulletType = this.weaponTypes[0];
        this.fireRate = this.weapons[this.bulletType].fireRate;
        this.currentWeaponSound = this.weapons[this.bulletType].sound;

        // Weapon random changer
        timer = this.time.create(false);
        timer.loop(5000, function(){
            /*bulletType = this.weaponTypes[Math.floor(Math.random() * this.weaponTypes.length)];
            fireRate = this.weapons[bulletType].fireRate;
            currentWeaponSound = weapons[bulletType].sound;
            nextFire = 0;*/
        }, this);
        timer.start();

        // Camera settings
        this.camera.follow(this.player);

        // Set up controls
        /*
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.shootButton = this.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        */
    },

    createEnemy: function(x, y) {
        enemy = this.enemies.create(x, y, "basic_enemy");
        enemy.health = 3;
        enemy.body.gravity.y = 700;
        enemy.velocity = -100;
        enemy.body.velocity.x = enemy.velocity;
        enemy.body.immovable = true;

        enemy.aggroRange = this.rnd.integerInRange(75, 150);

        enemy.changeDirection = function() {
            this.velocity = this.velocity * -1;
            this.body.velocity.x = this.velocity;
        };
    },

    update: function () {
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.collide(this.player, this.outer);

        this.physics.arcade.collide(this.enemies, this.layer);
        this.physics.arcade.collide(this.enemies, this.outer, function(enemy, wall){
            enemy.changeDirection();
        });

        this.physics.arcade.collide(this.bullets, this.layer, function(bullet) {
            bullet.kill();
        });

        this.physics.arcade.collide(this.bullets, this.outer, function(bullet) {
            bullet.kill();
        });

        this.physics.arcade.collide(this.player, this.enemies);

        this.physics.arcade.overlap(this.enemies, this.bullets, function(enemy, bullet){
            enemy.damage(1);
            bullet.kill();
        });

        /* Enemy basic AI */
        this.enemies.forEach(function(enemy){

            // Check aggro zone
            var distance = Math.sqrt(Math.pow((this.player.x - enemy.x), 2) + Math.pow((this.player.y - enemy.y), 2));
            if(distance < enemy.aggroRange) {
                enemy.body.velocity.x = 0;
            } else {
                if(enemy.x > this.player.x) {
                    enemy.body.velocity.x = -150;
                } else {
                    enemy.body.velocity.x = 150;
                }
            }

            // Manage facing
            if(enemy.x >this. player.x) {
                enemy.scale.x = 1;
            } else {
                enemy.scale.x = -1;
            }
        }.bind(this));

        /* MOVE MOVE */
        /*
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
        }
        */

        /* JUMP JUMP ! */
        /*
        if (this.jumpButton.isDown && this.time.now > jumpTimer && player.body.velocity.y == 0) {
            player.body.velocity.y = -550;
            jumpTimer = this.time.now + 750;
            jumpSound.play();
        }
        */

        /* SHOOT ! */
        /*
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
        */
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        // STOP THE MUSIC

        //  Go back to the main menu
        this.state.start('MainMenu');
    }

};
