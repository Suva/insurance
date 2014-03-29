define(function(require){

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);


    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3());

    var loader = new THREE.JSONLoader(true);
    loader.load("models/cargo-room.js", function(geometry, materials){
        var cargoRoom = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(cargoRoom);
    });

    var light = new THREE.PointLight(0xFFFFFF, 2, 200);
    scene.add(light);

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            camera.rotation.y +=  0.01;
            camera.position.z -=  0.2;
        }
    }

});