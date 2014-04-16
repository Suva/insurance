define(function(require){
    var fromColor = new THREE.Color(0xffb400);
    var toColor = new THREE.Color(0x51c8ff);

    var scene = new THREE.Object3D;
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);
    var Timer = require("Timer");
    var particleSpeed = 0.05;

    var StarField = require("component/starfield");
    scene.add(StarField.create(33));

    var sparkTexture = THREE.ImageUtils.loadTexture("images/spark.png");

    var particleSystem = createParticleSystem();
    scene.add(particleSystem);

    camera.position.set(0, 10, 30);
    camera.lookAt(particleSystem.position);

    var timer = new Timer();
    var flash = 1;
    return{
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            _.each(particleSystem.geometry.vertices, function(vert) {
                vert.add(vert.direction);
            });
            effectPass.uniforms.brightness.value = -0.2 * flash;
            flash = Math.max(0, flash - 0.1);
            scene.rotation.y += passed * 0.1;
            camera.position.z += passed;
            camera.position.y += passed * 5;
            camera.lookAt(particleSystem.position);
            particleSystem.material.size = Math.max(0, particleSystem.material.size - passed * 0.3);

            var colorPos = Math.min(1, timer.getTime(time) * 0.14);
            particleSystem.material.color.setRGB(
                Math.max(0, fromColor.r - colorPos) + Math.max(0, toColor.r - (1 - colorPos)),
                Math.max(0, fromColor.g - colorPos) + Math.max(0, toColor.g - (1 - colorPos)),
                Math.max(0, fromColor.b - colorPos) + Math.max(0, toColor.b - (1 - colorPos))
            );

        },
        init: function(){
            effectBloom.copyUniforms.opacity.value = 3;
            effectPass.uniforms.aberration.value = 0.001;
        }

    };

    function createParticleSystem() {
        var particleMat = new THREE.ParticleSystemMaterial({
            color: 0xFFFFFF,
            size: 2,
            map: sparkTexture,
            transparent: true,
            depthWrite: false
        });
        particleMat.color.setRGB(3, 3, 3);

        var particleGeo = _.reduce(_.range(0, 5000), function (geo, idx) {
            var vertex = new THREE.Vector3();

            if(idx < 2000){
                vertex.direction = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5)
                    .normalize()
                    .multiplyScalar(particleSpeed * 4 + (Math.random() * 0.5));
            } else {
                vertex.direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
                    .normalize()
                    .multiplyScalar(particleSpeed + (Math.random() * 0.1));
            }

            geo.vertices.push(vertex);
            return geo;
        }, new THREE.Geometry());
        var particleSystem = new THREE.ParticleSystem(particleGeo, particleMat);
        particleSystem.sortParticles = true;
        return particleSystem;
    }
});