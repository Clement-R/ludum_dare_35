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

    // Set up controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

    this.game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	this.game.physics.arcade.collide(this.player, this.game.layer);

	this.body.velocity.x = 0;

	// Check for input to move
    if (this.cursors.left.isDown) {
        this.body.velocity.x = -this.speed;
        if (this.facing != 'left') {
            // player.animations.play('left');
            this.facing = 'left';
            this.scale.x = 1;
        }
        idle = false;
    } else if (this.cursors.right.isDown) {
        this.body.velocity.x = this.speed;

        if (this.facing != 'right') {
            // player.animations.play('right');
            this.facing = 'right';
            this.scale.x = -1;
        }
        idle = false;
    } else {
        if (this.facing == 'left') {
            // player.frame = 0;
            this.scale.x = 1;
        } else {
            // player.frame = 5;
            this.scale.x = -1;
        }
    }

    if (this.jumpButton.isDown && this.game.time.now > this.jumpTimer && this.body.velocity.y == 0) {
        this.body.velocity.y = -550;
        this.jumpTimer = this.game.time.now + 750;
        this.game.jumpSound.play();
    }

    if (this.shootButton.isDown) {
    	if(this.facing == 'left') {
    		this.body.velocity.x += 100;
    		var x = this.x - 20;
    		var y = this.y - 5;
    	} else {
    		this.body.velocity.x -= 100;
    		var x = this.x + 20;
    		var y = this.y - 5;
    	}

        this.currentWeapon.fire(x, y);
    }
};

Player.prototype.setPhysic = function() {
	this.body.collideWorldBounds = true;
	this.body.gravity.y = 700;
};
