Boss = function (game, key, x, y, health) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.pistol1 = null;
    this.pistol2 = null;

    this.health = health;
    this.anchor.setTo(0.5, 0.5);
    this.game = game;
    this.inFight = false;

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

    this.phase = 1;
    this.lastUsed = 2;
    this.nextFire = 0;

    game.add.existing(this);
};

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.setPhysic = function() {
    this.body.allowGravity = false;
    this.body.immovable = true;
};

Boss.prototype.update = function() {

    if(!this.game.player.dead && this.inFight) {

        // Fight, patterns goes here
        this.fire();

    } else {
        var distance = Math.sqrt(Math.pow((this.game.player.x - this.x), 2) + Math.pow((this.game.player.y - this.y), 2));
        if(distance < 350) {
            this.inFight = true;
        }
    }
};

Boss.prototype.fire = function() {

    if(this.phase == 1) {
        if (this.game.time.time < this.nextFire) { return; }

        if(this.lastUsed == 2) {
            if(this.scale.x == 1) {
                var x = this.x - 45;
                var y = this.y + 30;
            } else {
                var x = this.x + 45;
                var y = this.y + 30;
            }
            this.pistol1.fire(x, y);
            this.lastUsed = 1;
        } else {
            if(this.scale.x == 1) {
                var x = this.x - 45;
                var y = this.y - 30;
            } else {
                var x = this.x + 45;
                var y = this.y - 30;
            }
            this.pistol2.fire(x, y);
            this.lastUsed = 2;
        }

        this.nextFire = this.game.time.time + 800;

    } else if (this.phase == 2) {

    }
};

Boss.prototype.kill = function() {
    var style = { font: "55px Arial", fill: "#ffffff"};
    var text1 = this.game.add.text(175, 40, "You win !", style);
    var style = { font
        : "30px Arial", fill: "#ffffff"};
    var text2 = this.game.add.text(155, 90, "Thanks for playing", style);
    text1.fixedToCamera = true;
    text2.fixedToCamera = true;

    this.destroy();
};

Boss.prototype.damage = function(amount) {
    if (this.alive) {

        emitter = this.game.add.emitter(this.x, this.y, 50);
        emitter.makeParticles('w_particle');
        emitter.gravity = 0;

        // FLASH !
        this.filter.matrix = this.experiment_filter;
        this.filters = [this.filter];

        this.game.time.events.add(Phaser.Timer.SECOND / 16, function(){
            this.filter.matrix = this.base_filter;
            this.filters = [this.filter];
        }, this);

        if(this.scale.x == 1) {
            emitter.setXSpeed(100, 150);
            emitter.setYSpeed(-10, -30);
        } else {
            emitter.setXSpeed(-100, -150);
            emitter.setYSpeed(-10, -30);
        }

        emitter.start(true, 250, null, 100);

        this.health -= amount;

        if (this.health <= 0) {
            this.kill();
        }
    }
};