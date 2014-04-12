define(function(require){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 5000);
    var loader = new THREE.JSONLoader(true);
    var origin = new THREE.Vector3();
    var StarSystem = require("component/starfield");
    var starfield = StarSystem.create(33, 100);

    scene.add(starfield);

    camera.position.set(0, 3, 10);
    camera.lookAt(origin);

    var ship;
    loader.load("models/spaceship-five.js", function(geometry, materials){
        materials[1].bumpMap.bumpScale = 0.0001;
        ship = new THREE.Object3D();
        ship.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));

        var tailLight = new THREE.PointLight(0xCCCCFF, 2, 3);
        tailLight.position.set(0, 0, 5.2);
        ship.add(tailLight);

        scene.add(ship);
        console.log(ship);
    });

    var light = new THREE.PointLight(0xFFFFFF, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    return {
        scene: scene,
        camera: camera,
        render: render,
        init: init
    };

    function render(time){
        ship.rotation.y += 0.01;
    }
});