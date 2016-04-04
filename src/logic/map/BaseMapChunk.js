var BaseBody = require("logic/actor/component/body/BaseBody");

function BaseMapChunk(config) {
    Object.assign(this, config);

    this.applyConfig({
        chunkSizeX: 200,
        chunkSizeY: 200
    });

    this.chunkLayout = [
        [-400, 0, 10, 400],
        [400, 0, 10, 400],
        [0, 200, 800, 10],
        [0, -200, 800, 10],
        [-310, 150, 100, 10],
        [-190, 150, 100, 10],
        [-250, -150, 200, 10],
        [-100, -160, 10, 80],
        [-100, 160, 10, 80],
        [-100, 0, 150, 40],
        [150, -20, 10, 200],
        [200, -20, 10, 200],
        [150, 175, 10, 50],
        [200, 175, 10, 50],
    ];

    this.bodies = this.createMapBodies();
}

BaseMapChunk.prototype.applyConfig = function(config){
    for (let property in config){
        this[property] = this[property] || config[property];
    }
};

BaseMapChunk.prototype.translateBodies = function(positionOffset){
    for (let i = 0; i < this.bodies.length; i++ ){
        this.bodies[i].position[0] += positionOffset[0];
        this.bodies[i].position[1] += positionOffset[1];
    }
};

BaseMapChunk.prototype.getBodies = function(){
    return this.bodies;
};

BaseMapChunk.prototype.createMapBodies = function(){
    var mapBodies = [];

    for (let i = 0, length = this.chunkLayout.length; i < length; i++) {
        let chunkObjectConfig = this.chunkLayout[i];
        mapBodies.push(
            new BaseBody({
                position: [chunkObjectConfig[0], chunkObjectConfig[1]],
                height: chunkObjectConfig[3],
                width: chunkObjectConfig[2],
                mass: 0,
                collisionType: 'terrain'
            })
        );
     }

     return mapBodies;
};




module.exports = BaseMapChunk;
