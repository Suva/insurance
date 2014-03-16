define(function(require){
    var StarSystem = require("component/starfield");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);

    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3());

    var starSystem = StarSystem.create();

    scene.add(starSystem);

    var startTime = null;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            if(!startTime)
                startTime = 0;

            var curTime = time - startTime;

            camera.rotation.y = curTime / 100;


        }
    }

});