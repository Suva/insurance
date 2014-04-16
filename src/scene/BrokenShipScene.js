define(function(require){
    var StarField = require("component/starfield");
    var Timer = require("Timer");

    var scene = new THREE.Object3D;
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);
    var jsonLoader = new THREE.JSONLoader();

    var ship;
    jsonLoader.load("models/spaceship-seven-broken.js", function(geo, mat){
        ship = new THREE.Object3D();
        var shipObjects = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(mat));
        shipObjects.position.x = -2;
        ship.add(shipObjects);
        ship.rotation.y = Math.PI;
        scene.add(ship);
    });

    var light = new THREE.PointLight(0xFFFFFF, 2, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

    var starField = StarField.create(33);

    scene.add(starField);

    var plane = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: THREE.ImageUtils.loadTexture("images/damages.png"),
            transparent: true
        })
    );
    plane.scale.multiplyScalar(10);

    scene.add(plane);

    camera.position.set(-5, 5, 6);
    var center = new THREE.Vector3();

    var factor = 1;
    var timer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            effectPass.uniforms.brightness.value = Math.min(0, effectPass.uniforms.brightness.value + 0.01);
            var passed = timer.getPassed(time);
            var localTime = timer.getTime(time);
            ship.rotation.y -= passed * 0.5 * factor;
            starField.rotation.y -= passed * 0.5 * factor;
            light.position.z -= passed * 1 * factor;
            camera.position.y -= passed * 0.5 * factor;
            camera.lookAt(center);
            if(localTime > 9){
               factor = Math.max(0, (3 - (localTime - 9)) / 3);
            }
            var brightness = (Math.sin(time * 8) + 1 / 2) + 0.9;
            plane.material.color.setRGB(brightness, brightness, brightness);
        },
        init: function(){
            effectBloom.copyUniforms.opacity.value = 0.8;
            effectPass.uniforms.aberration.value = 0.001;
            effectPass.uniforms.brightness.value = -1;
        }
    };
});