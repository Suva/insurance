define(function(require){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 5000);

    var Timer = require("Timer");

    var jsonLoader = new THREE.JSONLoader();
    var building;
    jsonLoader.load("models/hallway.js", function(geometry, materials) {
        building = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(building);
    });

    camera.position.set(0, 3, 16);
    var lookAtVector = new THREE.Vector3(0, 3, 0);

    var light = new THREE.PointLight(0xFFFFFF, 0.2, 20);
    light.position.set(0, 2, 12);
    scene.add(light);

    var light2 = new THREE.PointLight(0xFFFFFF, 0.2, 20);
    light.position.set(0, 2, 4);
    scene.add(light2);

    var light3 = new THREE.PointLight(0xFFFFFF, 0.3, 30);
    scene.add(light3);

    var timer = new Timer();
    var lightTimer = new Timer();
    var flash = 3;
    var aberration = 0;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            camera.position.z -= passed * 2;
            camera.lookAt(lookAtVector);
            light3.position = camera.position;

            effectPass.uniforms.brightness.value = 0.3 * flash;
            flash = Math.max(0, flash - 0.1);

            if(timer.getTime(time) > 4.5){
                effectPass.uniforms.brightness.value += lightTimer.getTime(time) / 2;
            }

            effectPass.uniforms.aberration.value = 0.002 * aberration;
            aberration = Math.max(0, aberration - 0.1);

        },
        init: function(){
            effectPass.uniforms.brightness.value = 0;
            effectPass.uniforms.aberration.value = 0;
        },
        onEvent: function(event){
            if(event.instrument == 1 && event.note == "C-3"){
                aberration = 1;
            }
            if(event.instrument == 1 && event.note == "D-3"){
                flash = 1;
            }
        }
    }

});