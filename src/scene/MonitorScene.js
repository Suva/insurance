define(function(require) {
    var Timer = require("Timer");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);

    var loader = new THREE.JSONLoader();
    var monitor, lookPoint;

    loader.load("models/monitor.js", function (geometry, materials) {
        monitor = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(monitor);
        lookPoint = monitor.position.clone();
        lookPoint.x += .2;
    });

    camera.position.set(0, 0, 3);
    camera.lookAt(new THREE.Vector3());

    var light1 = new THREE.PointLight(0xFF6666, 0.9, 60);
    light1.position.set(30, 10, 30);
    scene.add(light1);

    var light2 = new THREE.PointLight(0x66FF66, 0.9, 60);
    light2.position.set(-30, 10, 30);
    scene.add(light2);

    var light4 = new THREE.PointLight(0xCCCCCC, 0.8, 120);
    light4.position.set(20, 0, 70);
    scene.add(light4);

    var timer = new Timer();

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            camera.position.x += passed * 0.05;
            camera.position.z += passed * 0.01;
            camera.position.y += passed * 0.05;

            lookPoint.y = (
                (Math.sin(timer.getTime(time) * 2.571)) *
                (Math.sin(timer.getTime(time) * 3.514)) *
                (Math.sin(timer.getTime(time) *.93))
            ) * 0.005;

            lookPoint.x = 0.3 + (
                (Math.sin(timer.getTime(time) * 1.492)) *
                (Math.sin(timer.getTime(time) * 2.5124)) *
                (Math.sin(timer.getTime(time) *.34))
            ) * 0.005;
            camera.lookAt(lookPoint);

            light1.position.x -= passed * 2;
            light2.position.x += passed * 2;
        }

    }
});