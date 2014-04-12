define(function(require){
    var scene = require("scene/BridgeScene");
    var renderScene = new THREE.Scene();
    renderScene.fog = new THREE.FogExp2(0, 0);
    renderScene.add(scene.scene);
    if(scene.init) scene.init();

    return {
        getScene: function(){
            return {
                renderScene: renderScene,
                sceneObject: scene
            };
        }
    }
});