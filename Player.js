/*
nextFire = 0;
*/

Player = function (game) {
    Phaser.Sprite.call(this, game, 2 * 32, 2 * 32, "player");

    // this.weapons = [];
    this.currentWeapon = null;
    this.health = 20;
    this.jumpTimer = 0;
    this.facing = "right";
    this.speed = 200;
    this.game = game;

    this.anchor.setTo(.5, .5);

    this.filter = new PIXI.ColorMatrixFilter();
    this.experiment_filter = [1,1,1,1,
                              1,1,1,1,
                              1,1,1,1,
                              0,0,0,1];
    this.base_filter = [1,0,0,0,
                        0,1,0,0,
                        0,0,1,0,
                        0,0,0,1];
    this.filter.matrix = this.base_filter;
    this.filters = [this.filter];

    /*
    this.animations.add("run");
    this.animations.play("run")
    */

    // Set up controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    this.slowMo = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    this.game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	this.body.velocity.x = 0;

	// Check for input to move
    if (this.cursors.left.isDown) {
        this.body.velocity.x = -this.speed;
        if (this.facing != 'left') {
            this.facing = 'left';
            this.scale.x = 1;
        }
        idle = false;
    } else if (this.cursors.right.isDown) {
        this.body.velocity.x = this.speed;

        if (this.facing != 'right') {
            this.facing = 'right';
            this.scale.x = -1;
        }
        idle = false;
    } else {
        if (this.facing == 'left') {
            this.scale.x = 1;
        } else {
            this.scale.x = -1;
        }
    }

    if (this.jumpButton.isDown && this.game.time.now > this.jumpTimer && this.body.velocity.y == 0) {
        this.body.velocity.y = -550;
        this.jumpTimer = this.game.time.now + 750;
        this.game.jumpSound.play();
    }

    if (this.shootButton.isDown) {
    	// this.game.camera.shake(0.000005, 125, Phaser.Camera.SHAKE_BOTH);

    	if(this.facing == 'left') {
    		var x = this.x - 20;
    		var y = this.y - 5;
    	} else {
    		var x = this.x + 20;
    		var y = this.y - 5;
    	}

        this.currentWeapon.fire(x, y);
    }

    if (this.slowMo.isDown) {
    	this.game.time.slowMotion = 4.0;
    } else {
    	this.game.time.slowMotion = 1.0;
    }
};

Player.prototype.setPhysic = function() {
	this.body.collideWorldBounds = true;
	this.body.gravity.y = 700;
};

Player.prototype.damage = function(amount) {
	// this.game.camera.flash("0xffbbbb", 75);

    if (this.alive) {
    	// FLASH !
        this.filter.matrix = this.experiment_filter;
        this.filters = [this.filter];

        this.game.time.events.add(Phaser.Timer.SECOND / 16, function(){
            this.filter.matrix = this.base_filter;
            this.filters = [this.filter];
        }, this);

        if(this.scale.x == 1) {
            // left
            this.body.velocity.x += 1500;
        } else {
            // right
            this.body.velocity.x -= 1500;
        }

        this.health -= amount;

        if (this.health <= 0) {
            this.destroy();
            this.game.load("")
        }
    }
};