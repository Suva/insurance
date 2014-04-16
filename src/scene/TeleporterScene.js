define(function(require){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 5000);

    var screenPosition = new THREE.Vector3(-4.9, 1.4, 2.5);

    var Timer = require("Timer");
    var Ease = require("ease");

    var jsonLoader = new THREE.JSONLoader();
    var building;
    jsonLoader.load("models/teleporter.js", function(geometry, materials) {
        materials[2].opacity = 0;
        building = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(building);
    });

    var startVector = new THREE.Vector3(0, 3, 20);
    var endVector = screenPosition.clone();
    endVector.z += 4.1;
    endVector.y += 1.8;
    endVector.x += 0.7;

    camera.position.set(0, 3, 20);
    var lookAtVector = new THREE.Vector3(0, 3, 0);

    var light = new THREE.PointLight(0x00FF00, 0.8, 20);
    light.position.set(-10, 6, 12);
    scene.add(light);

    var light2 = new THREE.PointLight(0x0000FF, 0.8, 20);
    light.position.set(10, 6, 12);
    scene.add(light2);

    var light3 = new THREE.PointLight(0x6666FF, 0.4, 30);
    scene.add(light3);

    var timer = new Timer();
    var hue = 0;
    var position = 0;
    var randomVector = new THREE.Vector3();

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            camera.lookAt(screenPosition);

            randomVector.x = Math.max(-0.3, Math.min(0.3, randomVector.x + (Math.random() - 0.5) * 0.001));
            randomVector.y = Math.max(-0.3, Math.min(0.3, randomVector.y + (Math.random() - 0.5) * 0.001));
            randomVector.z = Math.max(-0.3, Math.min(0.3, randomVector.z + (Math.random() - 0.5) * 0.001));

            var easedPosition = Ease.inOutCubic(position);
            camera.position =
                endVector.clone().multiplyScalar(easedPosition).add(
                    startVector.clone().multiplyScalar(1 - easedPosition)
                ).add(randomVector);

            position = Math.min(1, position + passed * 0.3);

            light3.position = camera.position;
            light3.color.setHSL(hue, 1, 0.5);
            hue += passed * 0.1;
            if(hue > 1) hue = hue -1;



        },
        init: function(){
            effectPass.uniforms.brightness.value = 0;
            effectPass.uniforms.aberration.value = 0;
        }
    }

});