define(function(require){
    var scene = new THREE.Object3D;
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);
    var jsonLoader = new THREE.JSONLoader();
    var missile;

    jsonLoader.load("models/missile.js", function(geometry, materials) {
        missile = new THREE.Object3D;
        missile.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));
        var tailLight = new THREE.PointLight(0x333FF, 2, 3);
        tailLight.position.z = 1.28;
        missile.add(tailLight);
        scene.add(missile)
    });

    camera.position.set(0, 2, 3);
    camera.lookAt(new THREE.Vector3());

    var light = new THREE.PointLight(0xFFFFFF, 1, 50);
    light.position.set(0, 10, 10);
    scene.add(light);

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            missile.rotation.y += 0.01;
        }
    }

});