define(function(require) {
    var Timer = require("Timer");
    var Ease = require("ease");
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);
    var aberration = 1;
    var flash = 0;

    var StarField = require("component/starfield");
    scene.add(StarField.create(33));

    var texture = THREE.ImageUtils.loadTexture("images/explosion.png");

    texture.premultiplyAlpha = true;

    var screen = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        })
    );

    var screen2 = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/explosion-2.jpg"),
            transparent: true
        })
    );
    screen2.position.z = 0.001;
    scene.add(screen2);

    scene.add(screen);

    camera.position.set(0, 0, 5.8);
    camera.lookAt(screen.position);

    timer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            effectPass.uniforms.aberration.value = 0.003 * aberration;
            aberration = Math.max(0, aberration - 0.01);


            var localTime = timer.getTime(time);
            if(localTime > 15 && localTime < 40){
                screen2.material.opacity = Ease.inCubic(1 - ((localTime - 15) / 25));
            }

            if(localTime > 10){
                effectPass.uniforms.brightness.value -= passed * 0.1;
            } else {
                effectPass.uniforms.brightness.value = Ease.inCubic(flash);
                flash = Math.max(0, flash - 0.003);
            }
            camera.position.z -= passed * 0.1;

        },
        onEvent: function(event){
            if(event.instrument == 1 && event.note == 'C-3'){
                screen2.visible = true;
                flash = 1;
                aberration = 1;
            }
        },
        init: function(){
            screen2.visible = false;
        }
    }
});