function Core(worker){
    this.makeMainComponents(worker);
    this.startGameLoop();
    this.scene.fillScene();
    this.initFpsCounter();
}

Core.prototype.makeMainComponents = function(worker){
    this.world = new GameWorld();
    this.actorManager = new ActorManager({world: this.world, core: this});
    this.renderBus = new RenderBus(worker);
    this.scene = new GameScene({world: this.world, actorManager: this.actorManager});
};

Core.prototype.initFpsCounter = function(){
    this.logicTicks = 0;
    if(Constants.SHOW_FPS){
        setInterval(()=>{
            console.log('logicTicks: ', this.logicTicks);
            this.logicTicks = 0;
        }, 1000);
    }
};

Core.prototype.processGameLogic = function(){
    this.actorManager.update(this.renderBus.inputState);
    this.world.step(1 / Constants.LOGIC_REFRESH_RATE);
    this.renderBus.postMessage('updateActors', this.world.makeUpdateData());
    this.logicTicks ++;
    this.scene.update();
};

Core.prototype.startGameLoop = function(){
    var logicLoop = new THREEx.PhysicsLoop(Constants.LOGIC_REFRESH_RATE);
    logicLoop.add(this.processGameLogic.bind(this));
    logicLoop.start();
};
