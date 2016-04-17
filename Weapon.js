var Weapon = {};

Weapon.Pistol = function (game) {
	// new Group(game, parent, name, addToStage, enableBody, physicsBodyType)
    Phaser.Group.call(this, game, game.world, 'Pistol',
    				  false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 750;
    this.fireRate = 500;
    this.game = game;
    this.fireSound = this.game.pistolSound;

    for (var i = 0; i < 256; i++) {
        this.add(new Bullet(game, 'test_bullet', 'player'), true);
    }

    return this;
};

Weapon.Pistol.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pistol.prototype.constructor = Weapon.Pistol;

Weapon.Pistol.prototype.fire = function (x, y) {
    if (this.game.time.time < this.nextFire) { return; }

    // MUZZLE FLASH
    var rangeCircle = this.game.add.graphics(0, 0);
    rangeCircle.x = 0;
    rangeCircle.y = 0;

    rangeCircle.lineStyle(0);
    rangeCircle.beginFill(0xFFFFFF);
    rangeCircle.drawCircle(x, y, 20);
    this.game.time.events.add(Phaser.Timer.SECOND * 0.05, function(){
        rangeCircle.clear();
    }, this);

    if(this.game.player.facing == "left") {
        this.game.player.body.velocity.x += 100;
        this.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
    } else {
        this.game.player.body.velocity.x -= 100;
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    }

    this.fireSound.play();
    this.nextFire = this.game.time.time + this.fireRate;
};

Weapon.Uzi = function (game) {
    // new Group(game, parent, name, addToStage, enableBody, physicsBodyType)
    Phaser.Group.call(this, game, game.world, 'Uzi',
                      false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 950;
    this.fireRate = 150;
    this.game = game;

    this.fireSound = this.game.uziSound;

    for (var i = 0; i < 256; i++) {
        this.add(new Bullet(game, 'chicken_bullet', 'player'), true);
    }

    return this;
};

Weapon.Uzi.prototype = Object.create(Phaser.Group.prototype);
Weapon.Uzi.prototype.constructor = Weapon.Uzi;

Weapon.Uzi.prototype.fire = function (x, y) {
    if (this.game.time.time < this.nextFire) { return; }

    // MUZZLE FLASH
    var rangeCircle = this.game.add.graphics(0, 0);
    rangeCircle.x = 0;
    rangeCircle.y = 0;

    rangeCircle.lineStyle(0);
    rangeCircle.beginFill(0xFFFFFF);
    rangeCircle.drawCircle(x, y, 20);
    this.game.time.events.add(Phaser.Timer.SECOND * 0.05, function(){
        rangeCircle.clear();
    }, this);

    var angle = this.game.rnd.integerInRange(-5, 5);
    if(this.game.player.facing == "left") {
        this.game.player.body.velocity.x += 100;
        this.getFirstExists(false).fire(x, y, angle, -this.bulletSpeed, 0, 0);
    } else {
        this.game.player.body.velocity.x -= 100;
        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);
    }

    this.fireSound.play();
    this.nextFire = this.game.time.time + this.fireRate;

};


// Copy paste to change sound, firerate and invert bulletSpeed
Weapon.EnemyPistol = function (game, user) {
    // new Group(game, parent, name, addToStage, enableBody, physicsBodyType)
    Phaser.Group.call(this, game, game.world, 'Pistol',
                      false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 750;
    this.fireRate = 750;
    this.game = game;
    this.user = user;
    this.fireSound = this.game.pistolSound;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'test_bullet', 'enemy'), true);
    }

    return this;
};

Weapon.EnemyPistol.prototype = Object.create(Phaser.Group.prototype);
Weapon.EnemyPistol.prototype.constructor = Weapon.EnemyPistol;

Weapon.EnemyPistol.prototype.fire = function (x, y) {
    if (this.game.time.time < this.nextFire) { return; }

    // MUZZLE FLASH
    var rangeCircle = this.game.add.graphics(0, 0);
    rangeCircle.x = 0;
    rangeCircle.y = 0;

    rangeCircle.lineStyle(0);
    rangeCircle.beginFill(0xFFFFFF);
    rangeCircle.drawCircle(x, y, 20);
    this.game.time.events.add(Phaser.Timer.SECOND * 0.05, function(){
        rangeCircle.clear();
    }, this);

    if(this.user.scale.x == 1) {
        this.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
    } else {
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    }

    this.fireSound.play();
    this.nextFire = this.game.time.time + this.fireRate;
};