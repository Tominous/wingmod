var BobMixin = {    
    _mixinInstanceValues: {
        _bobZTop: 10,
        _bobSpeed: Utils.rand(18,22)/10000,
        _bobSpeedZ: Utils.rand(35,45)/1000
    },
    doBob: function(){
        this._position[2] += this._bobSpeedZ;
        if (this._position[2] > this._bobZTop){
            this._bobSpeedZ -= this._bobSpeed;
        } else {
            this._bobSpeedZ += this._bobSpeed;
        }
    }
};

module.exports = BobMixin;