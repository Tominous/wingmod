var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var ActorConfig = require('shared/ActorConfig');

function PulseWaveProjectileActor(){
    this.applyConfig(ActorConfig.PULSEWAVEPROJECTILE);
    BaseActor.apply(this, arguments);    
}

PulseWaveProjectileActor.extend(BaseActor);
PulseWaveProjectileActor.mixin(ParticleMixin); 

PulseWaveProjectileActor.prototype.customUpdate = function(){
    let ringSections = 20;
    let angle = Utils.degToRad(360/ringSections);  
    let zPosition, xPosition, offsetPosition;
    let timerFactor = this.timer/(this.props.timeout+3);
    let radius = Utils.rand(15,20)/10 - timerFactor;  

    for (let i = 0; i < ringSections; i ++){        
        zPosition = Math.sin(i*angle) * radius;
        xPosition = Math.cos(i*angle) * radius;
        offsetPosition = this.getOffsetPosition(xPosition, Math.PI/2);
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            offsetPositionZ: zPosition,
            color: 'WHITE',
            scale: 1,
            alpha: 1 - timerFactor,
            alphaMultiplier: 0.9,
            particleVelocity: 0,
            lifeTime: 1
        }); 
    }

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 16 - timerFactor*3,
        alpha: 1 - timerFactor,
        alphaMultiplier: 0.94,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });
};

PulseWaveProjectileActor.prototype.onDeath = function(){
    let ringSections = 28;
    let angle = Utils.degToRad(360/ringSections);  
    let zPosition, xPosition, offsetPosition, xOffsetPosition;
    let timerFactor = this.timer/(this.props.timeout+3);
    let radius = 5 - timerFactor*3;  

    for (let i = 0; i < ringSections; i ++){        
        zPosition = Math.sin(i*angle) * radius;
        xPosition = Math.cos(i*angle) * radius;
        offsetPosition = this.getOffsetPosition(xPosition, Math.PI/2);
        xOffsetPosition = this.getOffsetPosition(-5);
        
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0] + xOffsetPosition[0],
            offsetPositionY: offsetPosition[1] + xOffsetPosition[1],
            offsetPositionZ: zPosition,
            color: 'BLUE',
            scale: 5,
            alpha: 2 - timerFactor*2,
            alphaMultiplier: 0.6,
            particleVelocity: 0,
            lifeTime: 3
        });
    }

    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0] + xOffsetPosition[0],
        offsetPositionY: offsetPosition[1] + xOffsetPosition[1],
        color: 'BLUE',
        alphaMultiplier: 0.6,
        scale: 30,
        alpha: 2 - timerFactor*2,
        lifeTime: 3,
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: 24,
        alpha: 2 - timerFactor*2,
        alphaMultiplier: 0.6,
        lifeTime: 3
    });
};

PulseWaveProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = PulseWaveProjectileActor;
