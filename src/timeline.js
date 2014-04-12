define(function(require) {
    var CargoRoomScene = require("scene/CargoRoomScene");
    var SaturnScene    = require("scene/SaturnScene");
    var BridgeScene    = require("scene/BridgeScene");
    var WarpScene      = require("scene/WarpScene");
    var MilkyWayScene  = require("scene/MilkyWayScene");

    var renderer = null;

    var currentScene = null;

    var allScenes = [
        CargoRoomScene,
        SaturnScene,
        BridgeScene,
        WarpScene,
        MilkyWayScene
    ];

    var renderScene = new THREE.Scene();
    renderScene.fog = new THREE.FogExp2(0, 0);

    _.each(allScenes, function(scene){
        renderScene.add(scene.scene);
    });

    var oldScene = null;

    return {
        getScene: function(){
            return {
                renderScene: renderScene,
                sceneObject: currentScene
            };
        },
        onEvent: function(event){
            if(typeof(event.pattern) == 'undefined') return;
            switch(event.pattern){
                case 0:
                    currentScene = SaturnScene;
                    break;
                case 4:
                    currentScene = CargoRoomScene;
                    break;
                case 5:
                    currentScene = BridgeScene;
                    break;
                case 6:
                    currentScene = MilkyWayScene;
                    break;
                case 7:
                    currentScene = SaturnScene;
                    break;
                case 8:
                    currentScene = WarpScene;
                    break;
            }

            if(oldScene != currentScene){
                _.each(oldScene ? [oldScene, currentScene] : allScenes, function(scene){
                    var visibility = (scene == currentScene) ? true : false;
                    scene.scene.traverse(function(obj) {
                        obj.visible = visibility;
                    })
                });
                if(currentScene.init){
                    currentScene.init({renderScene: renderScene, renderer: renderer});
                }
                oldScene = currentScene;
            }
        },
        setRenderer: function(r){
            renderer = r;
        }
    }
});