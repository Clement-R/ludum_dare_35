/*
nextFire = 0;
*/

Player = function (game) {
    Phaser.Sprite.call(this, game, 33 * 32, 12 * 32, "player");

    // this.weapons = [];
    // this.currentWeapon = null;
    this.health = 20;
    this.jumpTimer = 0;
    this.facing = "left";
    this.speed = 200;
    this.game = game;

    // Add key to change weapon
    /*
    var changeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    changeKey.onDown.add(this.changeWeapon, this, 1);
    */
    // Set up controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	this.game.physics.arcade.collide(this.player, this.game.layer);
    this.game.physics.arcade.collide(this.player, this.game.outer);

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

    /*if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    	var x = this.x + 57;
    	var y = this.y + 41;
        this.currentWeapon.fire(x, y);
    }*/

    /*
    this.game.physics.arcade.overlap(this,
									 this.game.enemies,
									 function(player, enemy) {
									 	player.damage(5);
									 	enemy.kill();
									 },
									 null,
									 this);
	*/

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
};

Player.prototype.setPhysic = function() {
	this.body.collideWorldBounds = true;
	this.body.gravity.y = 700;
};
