var WeaponMesh = require('renderer/gameUi/WeaponMesh');
var WeaponConfig = require('shared/WeaponConfig');

function WeaponSwitcherItem(config) {    
    const props = {
        availableWeapons: config.availableWeapons,
        amountOfWeapons: config.amountOfWeapons,
        scene: config.scene,
        angleBetweenItems: config.angleBetweenItems,
        rotationOffset: config.rotationOffset,
        rotationLimitMax: config.rotationLimit * config.angleBetweenItems,
        rotationLimitMin: -(config.rotationLimit + 1) * config.angleBetweenItems,
        rotationSpeed: 5,
        visibilityLimitMax: config.visibilityLimit * config.angleBetweenItems,
        visibilityLimitMin: -config.visibilityLimit * config.angleBetweenItems,
    };
    
    Object.freeze(props);
    this.props = props;

    let state = {
        weaponIndex: config.weaponIndex,
        rotation: config.rotationOnArc * this.props.angleBetweenItems,
        expectedRotation: config.rotationOnArc * this.props.angleBetweenItems,
        position: []
    };

    Object.preventExtensions(state);    
    this.state = state;
    this.mesh = this._createMesh(config);

    this.props.scene.threeScene.add(this.mesh); 
}

WeaponSwitcherItem.prototype.update = function(config) {
    this.mesh.visible = config.visible && (this.state.rotation > this.props.visibilityLimitMin) && (this.state.rotation < this.props.visibilityLimitMax) ;

    this.state.position = config.position;

    const offsetPosition = Utils.rotationToVector(Utils.degToRad(this.state.rotation + this.props.rotationOffset), 15);
    this.mesh.position.x = this.state.position[0] + offsetPosition[0];
    this.mesh.position.y = this.state.position[1] + offsetPosition[1];
    
    this.mesh.rotation.z = Utils.degToRad(this.state.rotation - 90 + this.props.rotationOffset);

    const scale = 1.5 - Math.abs(this.state.rotation)/30;
    this.mesh.scale.x = scale;
    this.mesh.scale.y = scale;
    this.mesh.scale.z = scale;

    if (this.state.rotation !== this.state.expectedRotation) {
        this._updateRotationToMatchExpectedRotation();
    }
};

WeaponSwitcherItem.prototype.updateRotationOnArc = function(expectedRotation) {
    this.state.expectedRotation = (this.getRotationOnArc() + expectedRotation) * this.props.angleBetweenItems;
};

WeaponSwitcherItem.prototype.getRotationOnArc = function() {
    return this.state.expectedRotation / this.props.angleBetweenItems;  
};

WeaponSwitcherItem.prototype._createMesh = function(){
    if (!this.props.availableWeapons[this.state.weaponIndex]) {        
        console.warn('invalid weapon index! Will create a default weapon mesh! Specified weapon index was: ', this.state.weaponIndex, 'but is now defaulted to 0');
        this.state.weaponIndex = 0;
    }
    return new WeaponMesh({
        modelName: WeaponConfig[this.props.availableWeapons[this.state.weaponIndex]].modelName
    });    
};

WeaponSwitcherItem.prototype._updateRotationToMatchExpectedRotation = function() {
    let rotation = this.state.rotation;
    let expectedRotation = this.state.expectedRotation;
    let rotationLimitMax = this.props.rotationLimitMax;
    let rotationLimitMin = this.props.rotationLimitMin;
    
    //upper overflow
    if (rotation >= rotationLimitMax) {
        this.state.weaponIndex = this._calculateNewWeaponIndexOnLowerOverflow();
        this.state.rotation = rotationLimitMin;
        this.state.expectedRotation = rotationLimitMin + this.state.expectedRotation - rotationLimitMax;        
        this._updateMesh();
    }

    //lower overflow
    if (rotation < rotationLimitMin) {
        this.state.weaponIndex = this._calculateNewWeaponIndexOnUpperOverflow();
        this.state.rotation = rotationLimitMax;
        this.state.expectedRotation = rotationLimitMax + this.state.expectedRotation + rotationLimitMax + this.props.angleBetweenItems;
        this._updateMesh();
    }
    
    if (rotation < expectedRotation) {
        this.state.rotation += this.props.rotationSpeed;
    }

    if (rotation > expectedRotation) {
        this.state.rotation -= this.props.rotationSpeed;
    }
};

WeaponSwitcherItem.prototype._updateMesh = function() {
    this.mesh.setNewWeapon(this.props.availableWeapons[this.state.weaponIndex]);
};

WeaponSwitcherItem.prototype._calculateNewWeaponIndexOnLowerOverflow = function() {
    let counter = 0;
    let currentWeaponIndex = this.state.weaponIndex;

    while (counter < this.props.amountOfWeapons) {
        currentWeaponIndex --;
        if (currentWeaponIndex < 0) {
            currentWeaponIndex = this.props.availableWeapons.length - 1;
        }
        counter ++;
    }

    return currentWeaponIndex;    
};

WeaponSwitcherItem.prototype._calculateNewWeaponIndexOnUpperOverflow = function() {
    let counter = 0;
    let currentWeaponIndex = this.state.weaponIndex;

    while (counter < this.props.amountOfWeapons) {
        currentWeaponIndex ++;
        if (currentWeaponIndex > this.props.availableWeapons.length - 1) {
            currentWeaponIndex = 0;
        }
        counter ++;
    }

    return currentWeaponIndex;
};


module.exports = WeaponSwitcherItem;