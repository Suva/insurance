define(function(require){
    var StarSystem = require("component/starfield");
    var InsuranceLogo = require("component/InsuranceLogo");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 5000);

    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3());

    var starSystem = StarSystem.create(33, 100);
    scene.add(starSystem);

    var container = new THREE.Object3D();
    container.add(InsuranceLogo.system);

    container.add(camera);
    scene.add(container);

    var startTime = null;
    var stage = 0;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            if(!startTime)
                startTime = time;

            var curTime = time - startTime;

            container.position.z = (curTime) * 60;

            camera.rotation.z = -curTime*0.05;

            if(stage > 0){
                InsuranceLogo.render(curTime);
            }
        },
        onEvent: function(event){
            if(event.pattern == 6){
                stage = 1;
            }
        }
    }

});