define(function(require){
    var Timer = require("Timer");
    var Starfield = require("component/starfield");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(70, 16 / 9, 0.1, 5000);

    camera.position.set(0, 0.6, 2.5);
    camera.lookAt(new THREE.Vector3(0, -1, 0));

    var milkyWay;
    new THREE.JSONLoader().load("models/milkyway.js", function(geometry, materials){
        milkyWay = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(milkyWay);
    });

    var starSystem = Starfield.create(33);
    scene.add(starSystem);

    var timer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var timePassed = timer.getPassed(time);
            milkyWay.rotation.y += timePassed * 0.01;
            starSystem.rotation.y += timePassed * 0.02;
            effectBloom.copyUniforms.opacity.value = ((Math.sin(time * 25) * Math.sin(time * 33) * Math.sin(time * 17.1)) + 1 / 2) * 0.1 + 1.5;
            effectPass.uniforms.aberration.value = Math.random() * 0.001;
        }
    }

});
