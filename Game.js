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

        this.layer = this.map.createLayer("level");
        this.map.setCollisionBetween(1, 1, true, "level");
        this.layer.resizeWorld();

        // Create player and add physic body and collision with world bounds
        this.player = new Player(this);
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.setPhysic();

        this.jumpSound = this.game.add.audio('jump');
        this.jumpSound.volume = 0.5;

        // Set up enemy
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.createEnemy(200, 100);
        this.createEnemy(240, 100);
        this.createEnemy(400, 100);

        /* Weapons sounds */
        this.pistolSound = this.game.add.audio('pistol_shoot');
        this.pistolSound.volume = 0.5;

        this.uziSound = this.game.add.audio('uzi_shoot');
        this.uziSound.volume = 0.5;


        /* TEST ZONE */
        var bird_texture = this.add.bitmapData(64, 16);
        bird_texture.ctx.beginPath();
        bird_texture.ctx.rect(0,0,64,16);
        bird_texture.ctx.fillStyle = '#ff0000';
        bird_texture.ctx.fill();

        var plat = this.add.sprite(40, 20, bird_texture);

        var platTween = this.add.tween(plat.scale).to({x: 2}, 1250, "Linear", true, 0, -1, true);
        // platTween.yoyo(true, 1000);
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
        timer.loop(5000, function(){

            weapon = this.weapons[Math.floor(Math.random() * this.weapons.length)];
            // this.player.currentWeapon = weapon;

        }, this);
        timer.start();

        // Camera settings
        this.camera.follow(this.player);
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

        this.physics.arcade.collide(this.enemies, this.layer);

        this.physics.arcade.collide(this.player, this.enemies);

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
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        // STOP THE MUSIC

        //  Go back to the main menu
        this.state.start('MainMenu');
    }

};
