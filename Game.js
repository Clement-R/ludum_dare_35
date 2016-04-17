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
 };

BasicGame.Game.prototype = {
    create: function () {
        this.time.slowMotion = 1.0;
        this.weapons = [];
        this.player = null;
        this.enemies = null;

        this.stage.backgroundColor = "#2b87c4"
        this.music = this.add.audio('theme', 0.5, true);
        this.music.play();

        // Set up game physic engine
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 350;

        // Create map
        this.map = this.add.tilemap("map");
        this.map.addTilesetImage("wall");
        this.map.addTilesetImage("back");

        this.background = this.map.createLayer("background");
        this.layer = this.map.createLayer("level");
        this.map.setCollisionBetween(1, 1, true, "level");
        this.layer.resizeWorld();

        // Create player and add physic body and collision with world bounds
        this.player = new Player(this);
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.setPhysic();

        this.jumpSound = this.game.add.audio('jump');
        this.jumpSound.volume = 0.25;

        /* Weapons sounds */
        this.pistolSound = this.game.add.audio('pistol_shoot');
        this.pistolSound.volume = 0.3;

        this.uziSound = this.game.add.audio('uzi_shoot');
        this.uziSound.volume = 0.3;

        /* TEST ZONE */
        this.platforms = this.add.group();

        this.laserTrapSound = this.game.add.audio('laser_activation');
        this.laserTrapSound.volume = 0.25;

        this.lazors = this.add.group();

        var lazor = this.add.sprite(53 * 32, 5 * 32, "laser_trap", 0);
        this.physics.enable(lazor, Phaser.Physics.ARCADE);
        lazor.body.allowGravity = false;
        lazor.body.immovable = true;
        this.lazors.add(lazor);

        lazorTimer = this.time.create(false);
        lazorTimer.loop(1500, function(){
            if(lazor.frame == 1) {
                lazor.loadTexture("laser_trap", 0);
                lazor.body.enable = false;
            } else {
                var distance = Math.sqrt(Math.pow((this.player.x - lazor.x), 2) + Math.pow((this.player.y - lazor.y), 2));
                if(distance <= 200) {
                    this.laserTrapSound.play();
                }
                lazor.body.enable = true;
                lazor.loadTexture("laser_trap", 1);
            }
        }, this);
        lazorTimer.start();

        /*  //TEST ZONE */

        // Create weapons
        // [0] : Pistol
        // [1] : Uzi
        this.weapons.push(new Weapon.Pistol(this));
        this.weapons.push(new Weapon.Uzi(this));

        // Assign the basic weapon to the player
        this.player.currentWeapon = this.weapons[1];

        // Weapon random changer
        timer = this.time.create(false);
        timer.loop(2500, function(){

            weapon = this.weapons[Math.floor(Math.random() * this.weapons.length)];
            this.player.currentWeapon = weapon;

        }, this);
        timer.start();

        // Boss door
        this.door = this.add.sprite(59 * 32, 14 * 32, "door");
        this.door.visible = false;
        this.physics.enable(this.door, Phaser.Physics.ARCADE);
        this.door.body.allowGravity = false;
        this.door.body.immovable = true;

        // Camera settings
        this.camera.follow(this.player);

        // Set up enemy
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        var enemy = new Enemy(this, 'basic_enemy', 650, 100,
                              3,
                              null);
        enemy.currentWeapon = new Weapon.EnemyPistol(this, enemy);
        this.physics.arcade.enable(enemy);
        enemy.setPhysic();
        this.enemies.add(enemy)

        var enemy = new Enemy(this, 'basic_enemy', 8 * 32, 10 * 32,
                              3,
                              null);
        enemy.currentWeapon = new Weapon.EnemyPistol(this, enemy);
        this.physics.arcade.enable(enemy);
        enemy.setPhysic();
        this.enemies.add(enemy)

        // set up boss
        this.boss = new Boss(this, 'boss', 75 * 32,
                             //(19 * 32) - 87,
                             this.game.world.height - 32 - 73,
                             50);
        this.boss.pistol1 = new Weapon.EnemyPistol(this, this.boss);
        this.boss.pistol2 = new Weapon.EnemyPistol(this, this.boss);
        this.physics.arcade.enable(this.boss);
        this.boss.setPhysic();
        this.enemies.add(this.boss)

        this.boss.body.allowGravity = false;
        this.boss.body.immovable = true;

        this.enemies.add(this.boss);
    },

    update: function () {
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.collide(this.player, this.platforms);

        this.physics.arcade.collide(this.player, this.lazors, function(player){
            player.damage(100);
        });

        this.physics.arcade.collide(this.enemies, this.layer);

        this.physics.arcade.collide(this.boss, this.player, function(boss, player){
            player.damage(1000);
        });

        this.physics.arcade.collide(this.player, this.enemies);

        if(this.player.x > 60 * 32) {
            this.door.visible = true;
            this.physics.arcade.collide(this.player, this.door);
        }
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        this.music.stop();

        //  Go back to the main menu
        this.state.start('MainMenu');
    }

};
