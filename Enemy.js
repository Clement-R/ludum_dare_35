Enemy = function (game, key, x, y, health, weapon) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.speed = 125;
    this.currentWeapon = weapon;
    this.health = health;
    this.anchor.setTo(0.5, 0.5);
    this.game = game;
    this.playerDetected = false,
    this.aggroRange = this.game.rnd.integerInRange(100, 150);

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

    this.game = game;

    game.add.existing(this);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.setPhysic = function() {
    this.body.velocity.x = -this.speed;

    this.body.gravity.y = 700;
    this.body.immovable = true;
};

Enemy.prototype.update = function() {
    this.body.velocity.x = 0;

    var distance = Math.sqrt(Math.pow((this.game.player.x - this.x), 2) + Math.pow((this.game.player.y - this.y), 2));
    if(distance > this.aggroRange && this.playerDetected) {
        if(this.body.velocity.y == 0) {
            if(this.x > this.game.player.x) {
                this.body.velocity.x = -this.speed;
            } else {
                this.body.velocity.x = this.speed;
            }
        }

        // Manage facing
        if(this.x > this.game.player.x) {
            this.scale.x = 1;
        } else {
            this.scale.x = -1;
        }
    }

    this.fire();
};

Enemy.prototype.fire = function() {

    if(this.scale.x == 1) {
        var x = this.x - 20;
        var y = this.y - 5;
    } else {
        var x = this.x + 20;
        var y = this.y - 5;
    }

    this.currentWeapon.fire(x, y);
};

Enemy.prototype.kill = function() {
    this.destroy();
};

Enemy.prototype.damage = function(amount) {
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
            this.body.velocity.y -= 100;
        } else {
            // right
            this.body.velocity.x -= 1500;
            this.body.velocity.y -= 100;
        }

        this.health -= amount;

        if (this.health <= 0) {
            this.kill();
        }
    }
};