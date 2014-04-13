define(function(require){
    var StarSystem = require("component/starfield");
    var Timer = require("timer");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);
    var loader = new THREE.JSONLoader(true);
    var origin = new THREE.Vector3();
    var starField = StarSystem.create(33, 100);

    scene.add(starField);

    camera.position.set(5, 6, 12);
    camera.lookAt(origin);

    loader.load("models/spaceship-five.js", function(geometry, materials){
        var ship;
        materials[1].bumpMap.bumpScale = 0.0001;
        ship = new THREE.Object3D();
        ship.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));

        var tailLight = new THREE.PointLight(0xCCCCFF, 2, 3);
        tailLight.position.set(0, 0, 5.2);
        ship.add(tailLight);

        ship.rotation.y = Math.PI;

        scene.add(ship);
    });

    var light = new THREE.PointLight(0xFFFFFF, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    var timer = new Timer();
    function render(time) {
        scene.rotation.y += 0.005;
        scene.rotation.z += 0.003;
    }

    return {
        scene: scene,
        camera: camera,
        render: render
    };
});