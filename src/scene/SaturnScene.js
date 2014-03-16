define(function(require){
    var StarSystem = require("component/starfield");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 1000);
    camera.lookAt(new THREE.Vector3());

    scene.add(StarSystem.create(27));
    scene.add(createLight());

    new THREE.JSONLoader().load("models/saturn.js", function(geometry, materials){
        var saturn = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        saturn.scale.set(50, 50, 50);
        saturn.position.set(0, 0, -400);
        saturn.castShadow = true;
        saturn.receiveShadow = true;
        scene.add(saturn);
    });

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            // camera.rotation.y -= 0.001;



        }
    }

    function createLight() {
        var light = new THREE.DirectionalLight(0xFFFFFF, 2, 1000);
        light.castShadow = true;
        light.shadowBias = 0.001;
        light.shadowDarkness = 1;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        light.position.set(-400, 100, 400);
        return light;
    }
});