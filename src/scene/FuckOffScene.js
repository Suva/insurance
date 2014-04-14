define(function(require){
    var Timer = require("Timer");
    var Ease = require("ease");
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);

    var layers = _.map(["FU1.jpg", "FU2.png", "FU3.png", "FU4.png", "FU5.png", "FU6.png"], function(fileName){
        return new THREE.Mesh(
            new THREE.PlaneGeometry(16, 10),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("images/"+ fileName),
                transparent: true
            })
        )
    });
    layers[2].position.y = -10;

    var height = 0;
    var screen = _.reduce(layers, function(obj, layer){
        obj.add(layer);
        layer.position.z = height;
        height += 0.01;
        return obj;
    }, new THREE.Object3D());

    scene.add(screen);

    camera.position.set(0, 0, 6);
    camera.lookAt(screen.position);

    var timer = new Timer();

    var fingerPos = 0;
    return {
        scene: scene,
        camera: camera,
        render: function(time) {
            var passed = timer.getPassed(time);
            camera.position.z -= passed * 0.05;
            layers[0].scale.addScalar(-passed * 0.001);
            layers[3].position.x += passed * 0.1;
            layers[4].position.x -= passed * 0.1;

            if (timer.getTime(time) > 1.5) {
                layers[2].position.y = Ease.outCubic(Math.min(1, fingerPos += passed * 0.8)) * 10 - 10;
            }

            if (timer.getTime(time) > 4.5) {
                effectPass.uniforms.brightness.value = Math.min(1, effectPass.uniforms.brightness.value + passed)
            }
        },
        init: function(){
            effectBloom.copyUniforms.opacity.value = 0.3;
        }
    }
});