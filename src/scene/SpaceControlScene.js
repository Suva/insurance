define(function(require){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 5000);

    var Timer = require("Timer");

    var jsonLoader = new THREE.JSONLoader();
    var building;
    jsonLoader.load("models/spacecontrol.js", function(geometry, materials) {
        building = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(building);
    });

    camera.position.set(0, 3, 15);
    var lookAtVector = new THREE.Vector3(0, 5, 0);


    var light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(0, 1, 1);
    scene.add(light);

    var timer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            camera.position.z -= passed;
            lookAtVector.y -= passed * 0.3;
            camera.lookAt(lookAtVector);
            effectPass.uniforms.brightness.value = Math.min(0, passed, effectPass.uniforms.brightness.value + passed * 0.5);
        },
        init: function(){
            effectPass.uniforms.brightness.value = -1;
            effectPass.uniforms.aberration.value = 0;
        }
    }

});