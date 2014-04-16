define(function(require) {
    var CargoRoomScene          = require("scene/CargoRoomScene");
    var SaturnScene             = require("scene/SaturnScene");
    var BridgeScene             = require("scene/BridgeScene");
    var WarpScene               = require("scene/WarpScene");
    var MilkyWayScene           = require("scene/MilkyWayScene");
    var EnemyShipScene          = require("scene/EnemyShipScene");
    var PirateScene             = require("scene/PirateScene");
    var FuckOffScene            = require("scene/FuckOffScene");
    var ShatterScene            = require("scene/ShatterScene");
    var EnemyHitScene           = require("scene/EnemyHitScene");
    var MonitorScene            = require("scene/MonitorScene");
    var MissileScene            = require("scene/MissileScene");
    var EnemyShipExplosionScene = require("scene/EnemyShipExplosionScene");
    var BrokenShipScene         = require("scene/BrokenShipScene");


    var renderScene, render2Scene, render3Scene;

    var renderer = null;

    var currentScene = null;

    var allScenes = [
        SaturnScene,
        CargoRoomScene,
        BridgeScene,
        MilkyWayScene,
        WarpScene,
        EnemyShipScene,
        PirateScene,
        ShatterScene,
        FuckOffScene,
        EnemyHitScene,
        MonitorScene,
        MissileScene,
        EnemyShipExplosionScene,
        BrokenShipScene
    ];

    function initRenderScene(scenes){
        var renderTarget = new THREE.WebGLRenderTarget(16, 9);
        var renderCam = new THREE.PerspectiveCamera(80, 16 / 9, 0.1, 5000);
        var renderScene = new THREE.Scene();

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
                    currentScene = WarpScene;
                    break;
                case 17:
                    currentScene = EnemyShipScene;
                    break;
                case 18:
                    currentScene = PirateScene;
                    break;
                case 19:
                    currentScene = FuckOffScene;
                    break;
                case 20:
                    currentScene = EnemyShipScene;
                    break;
                case 21:
                    currentScene = ShatterScene;
                    break;
                case 22:
                    currentScene = EnemyShipScene;
                    break;
                case 23:
                    currentScene = ShatterScene;
                    break;
                case 24:
                    currentScene = EnemyHitScene;
                    break;
                case 25:
                    currentScene = MonitorScene;
                    break;
                case 26:
                    currentScene = EnemyHitScene;
                    break;
                case 27:
                    currentScene = MissileScene;
                    break;
                case 28:
                    currentScene = EnemyShipExplosionScene;
                    break;
                case 29:
                    currentScene = BrokenShipScene;
                    break;
                case 31:
                    currentScene = MonitorScene;
                    break;
            }
            renderScene = renderScenes[getSceneId(currentScene)];

            if(oldScene != currentScene){
                if(currentScene.init){
                    currentScene.init({renderScene: renderScene, renderer: renderer});
                }
                oldScene = currentScene;
            }
        },
        setRenderer: function(r){
            renderer = r;
            renderScenes = _.map(allScenes, function(scene){
                return initRenderScene([scene])
            });
            console.log(renderScene);

        }
    }
    function getSceneId(scene){
        for(var i = 0; i < allScenes.length; i++){
            if(allScenes[i] == scene){
                console.log("Returning " + i);
                return i;
            }
        }
        return false;
    }
});