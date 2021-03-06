var ShipActor = require('logic/actor/player/ShipActor');
var ActorConfig = require('shared/ActorConfig');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var Weapon = require('logic/actor/component/weapon/Weapon');
var ActorTypes = require('shared/ActorTypes');
var WeaponConfig = require('shared/WeaponConfig');

function DemoShipActor(){
    this.applyConfig(ActorConfig.DEMOSHIP);    
    ShipActor.apply(this, arguments);
    this.weapon = this.createWeapon();
    this.brain = this.createBrain();    
}

DemoShipActor.extend(ShipActor);
DemoShipActor.mixin(BrainMixin);

DemoShipActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyTypes: ActorTypes.getEnemyTypes(),
        firingDistance: 800,
        shootingArc: 20,
        leadSkill: 1
    });
};

DemoShipActor.prototype.customUpdate = function(){
    this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

DemoShipActor.prototype.createWeapon = function(){
    const weaponConfig = Object.assign({
        actor: this,
        manager: this.manager,        
    }, WeaponConfig['RED_BLASTER'], {
        type: 'RED_BLASTER',
        firingPoints: [
            {offsetAngle: -50, offsetDistance: 4, fireAngle: 0},
            {offsetAngle: 50, offsetDistance: 4, fireAngle: 0}
        ]
    });

    return new Weapon(weaponConfig);
};

module.exports = DemoShipActor;
