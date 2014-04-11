define(function(require){
    var Timer = require("Timer");
    var Starfield = require("component/starfield");
    var Ease = require("ease");

    var scene = new THREE.Object3D();
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

    var timer = new Timer(),
        flash = 0,
        aberration = 0;

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var timePassed = timer.getPassed(time);
            milkyWay.rotation.y += timePassed * 0.01;
            starSystem.rotation.y += timePassed * 0.02;
            effectBloom.copyUniforms.opacity.value =
                ((Math.sin(time * 25) * Math.sin(time * 33) * Math.sin(time * 17.1)) + 1 / 2) * 0.1 + 1.5 + Ease.inCubic(flash);
            effectPass.uniforms.aberration.value = Math.random() * 0.001 + Ease.inCubic(aberration) * 0.004;

            flash = Math.max(0, flash - 0.1);
            aberration = Math.max(0, aberration - 0.1);
        },
        onEvent: function(event){
            if(event.instrument){
                if(event.instrument == 1 && event.note == 'C-3'){
                    aberration = 1;
                }
                if(event.instrument == 1 && event.note == 'D-3'){
                    flash = 1;
                }
            }
        }

    }

});
