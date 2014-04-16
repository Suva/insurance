define(function(require){
    var StarField = require("component/starfield");
    var Timer = require("Timer");

    var scene = new THREE.Object3D;
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);
    var jsonLoader = new THREE.JSONLoader();
    var missile;
    var aberration = 0;
    var flash = 4;

    jsonLoader.load("models/missile.js", function(geometry, materials) {
        missile = new THREE.Object3D;
        missile.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));
        var tailLight = new THREE.PointLight(0x333FF, 2, 3);
        tailLight.position.z = 1.28;
        missile.add(tailLight);
        scene.add(missile)
    });

    var ship;
    jsonLoader.load("models/spaceship-five.js", function(geometry, materials) {
        materials[1].bumpMap.bumpScale = 0.0001;
        ship = new THREE.Object3D();
        ship.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));

        var tailLight = new THREE.PointLight(0xCCCCFF, 2, 3);
        tailLight.position.set(0, 0, 5.2);
        ship.add(tailLight);

        ship.rotation.y = -2.1;

        ship.position.set(-50, 0, -50);

        scene.add(ship);
    });

    var starField = StarField.create(33);
    scene.add(starField);

    camera.position.set(0, 2, 3);
    camera.lookAt(new THREE.Vector3());

    var light = new THREE.PointLight(0xFFFFFF, 1, 50);
    light.position.set(0, 10, 10);
    scene.add(light);

    var timer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            starField.rotation.z -= 0.6 * passed;
            starField.rotation.x -= 0.6 * passed;
            missile.rotation.z -= 0.2 * passed;
            missile.rotation.y += 0.13 * passed;

            camera.position.z += passed * 3;
            camera.lookAt(missile.position);
            ship.position.z += passed * 9;
            ship.position.x += passed * 9;


            effectPass.uniforms.aberration.value = 0.002 * aberration;
            aberration = Math.max(0, aberration - 0.1);

            if (timer.getTime(time) > 4.5) {
                effectPass.uniforms.brightness.value = Math.min(1.5, effectPass.uniforms.brightness.value + passed * 3)
            } else {
                effectPass.uniforms.brightness.value = 0.3 * flash;
                flash = Math.max(0, flash - 0.1);
            }
        },
        onEvent: function(event) {
            if (event.instrument == 1) {
                if(event.note == 'C-3'){
                    aberration = 1;
                }
                if(event.note == 'D-3') {
                    flash = 1;
                }
            }
        }

    }
});