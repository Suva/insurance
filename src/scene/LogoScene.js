define(function(require){
    var StarSystem = require("component/starfield");
    var InsuranceLogo = require("component/InsuranceLogo");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);

    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3());

    var starSystem = StarSystem.create();
    scene.add(starSystem);

    var container = new THREE.Object3D();
    container.add(InsuranceLogo.system);

    container.add(camera);
    scene.add(container);

    var startTime = null;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            if(!startTime)
                startTime = 0;

            var curTime = time - startTime;

            container.position.z = (curTime) * 60;


            camera.rotation.z = -time*0.1;

            if(time > 2){
                InsuranceLogo.render(curTime);
            }
        }
    }

});