define(function(require){
    var Text = require("component/Text");
    var Timer = require("Timer");
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);

    var screen = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/insurance_scene.jpg"),
            transparent: true
        })
    );

    scene.add(screen);

    camera.position.set(0, 0, 5.5);
    camera.lookAt(screen.position);

    var text = Text.drawString("revision mmxiv", scene, new THREE.Vector3(-2.4, -3, 0));

    var timer = new Timer();
    var phase = 1;

    return {
        scene: scene,
        camera: camera,
        render: function(time) {
            var passed = timer.getPassed(time);
            camera.position.z -= passed * 0.05;

            if(effectPass.uniforms.brightness.value > 0){
                effectPass.uniforms.brightness.value -= passed * 2;
            } else {
                effectPass.uniforms.brightness.value = 0;
            }

            if(phase == 2){
                screen.material.opacity -= passed * 0.5;
                text.render(time);
                if(timer.getTime(time) > 3){
                    text.setCharScale(0);
                }

                if(timer.getTime(time) > 6){
                    $("canvas").hide();
                }
            }

        },
        init: function(){
            effectBloom.copyUniforms.opacity.value = 0.3;
            effectPass.uniforms.brightness.value = 1;
        },
        onEvent: function(event){
            if(event.pattern == 45){
                phase = 2;
            }
        }
    }
});