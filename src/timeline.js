define(function(require) {
    var CargoRoomScene = require("scene/CargoRoomScene");
    var SaturnScene    = require("scene/SaturnScene");
    var BridgeScene    = require("scene/BridgeScene");
    var WarpScene      = require("scene/WarpScene");
    var MilkyWayScene  = require("scene/MilkyWayScene");
    var BattleScene    = require("scene/BattleScene");

    var renderScene;

    var renderer = null;

    var currentScene = null;

    var stage1Scenes = [
        CargoRoomScene,
        SaturnScene,
        BridgeScene,
        MilkyWayScene,
    ];

    var stageTwoScenes = [
        WarpScene,
        BattleScene
    ];

    var allScenes = stage1Scenes;

    function initRenderScene(scenes){
        var renderTarget = new THREE.WebGLRenderTarget(10, 10);
        var renderCam = new THREE.PerspectiveCamera(80, 16 / 9, 0.1, 5000);
        var renderScene = new THREE.Scene();
        allScenes = scenes;

        renderCam.position.set(0, 0, -1000);
        renderCam.lookAt(new THREE.Vector3());

        renderScene.fog = new THREE.FogExp2(0, 0);

        _.each(scenes, function(scene){
            renderScene.add(scene.scene);
        });
        renderer.render(renderScene, renderCam, renderTarget);
        return renderScene;
    }

    var oldScene = null;

    return {
        getScene: function(){
            return {
                renderScene: renderScene,
                sceneObject: currentScene
            };
        },
        onEvent: function(event){
            var nextScene = null;
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
                    oldScene = null;
                    renderScene = initRenderScene(stageTwoScenes);
                    currentScene = WarpScene;
                    break;
                case 17:
                    currentScene = BattleScene;
                    break;
            }

            if(oldScene != currentScene){
                _.each(oldScene ? [oldScene, currentScene] : allScenes, function(scene){
                    var visibility = (scene == currentScene) ? true : false;
                    scene.scene.traverse(function(obj) {
                        obj.visible = visibility;
                        if(visibility == 1) console.log("*");
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
            renderScene = initRenderScene(stage1Scenes);
        }
    }
});