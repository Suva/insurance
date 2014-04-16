define(function(require){
    var StarField = require("component/starfield");
    var Timer = require("Timer");

    var scene = new THREE.Object3D;
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);
    var jsonLoader = new THREE.JSONLoader();

    var ship;
    jsonLoader.load("models/spaceship-seven-broken.js", function(geo, mat){
        ship = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(mat));
        ship.position.x = 2;
        ship.rotation.y = Math.PI;
        scene.add(ship);
    });

    var light = new THREE.PointLight(0xFFFFFF, 2, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

    var starField = StarField.create(33);

    scene.add(starField);

    camera.position.set(-5, 5, 6);
    var center = new THREE.Vector3();

    var factor = 1;
    var timer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            var localTime = timer.getTime(time);
            scene.rotation.y -= passed * 0.5 * factor;
            light.position.z -= passed * 2 * factor;
            camera.position.y -= passed * 0.5 * factor;
            camera.lookAt(center);
            if(localTime > 9){
               factor = Math.max(0, (3 - (localTime - 9)) / 3);
            }
        },
        init: function(){
            effectBloom.copyUniforms.opacity.value = 0.8;
            effectPass.uniforms.aberration.value = 0;
        }
    };
});