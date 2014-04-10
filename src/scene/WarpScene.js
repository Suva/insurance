define(function(require){
    var Random = require("random");
    var Timer = require("Timer");
    var Ease = require("ease");
    var Starfield = require("component/starfield");

    var scaling = 0;
    var rotSpeed = 0;
    var respawnLines = true;
    var brightness = 1;
    var aberration = 0;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 5000);
    scene.fog = new THREE.FogExp2(0, 0.008);

    camera.position.set(3, 2, 3);
    camera.lookAt(new THREE.Vector3(0, 0, -8));

    var lineSystem = createLineSystem(80, 215);
    scene.add(lineSystem);

    var spaceship;
    new THREE.JSONLoader().load("models/spaceship-seven.js", function(geometry, materials){
        var spaceshipObj = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        spaceshipObj.rotation.y = Math.PI / 2;
        spaceship = new THREE.Object3D();
        spaceship.position.set(0, 0, -3);
        spaceship.add(spaceshipObj);
        scene.add(spaceship);
    });

    var starSystem = Starfield.create(33);
    scene.add(starSystem);

    var light = new THREE.PointLight(0xFFFFFF, 1, 200);
    light.position = camera.position;
    scene.add(light);

    var lineTimer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){

            var timePassed = lineTimer.getPassed(time);

            if(brightness > 0){
                brightness = Math.max(0, brightness - timePassed * 0.3);
                effectPass.uniforms.brightness.value = Ease.outQuad(brightness);
            }

            if(scaling > 0) {
                scaling = Math.max(0, scaling - timePassed);
            }
            var scale = 1 + Ease.inQuint( scaling ) * 5;
            _.each(lineSystem.children, function(line){
                line.position.z += timePassed * 200;
                if(scaling > 0){
                    line.scale.set(scale, scale, 1);
                }

                if(respawnLines && line.position.z > 15) {
                    line.position.z -= 215;
                }
            });

            light.intensity = 1 + Ease.inQuint( scaling );

            lineSystem.rotation.z += timePassed * 0.05 + Ease.inOutCubic(rotSpeed) * timePassed;
            rotSpeed = Math.max(0, rotSpeed - timePassed * 3);

            spaceship.position.y =
                (Math.sin(time / 3.752) * Math.sin(time) * Math.sin(time * 2.11))* 0.2;

            spaceship.position.z =
                -3 +
                (Math.sin(time / 3.6) * Math.sin(time / 1.3) * Math.sin(time / 4.22)) * 0.5;


            spaceship.rotation.z =
                ((Math.sin(time / 1.8884) * Math.sin(time) * Math.sin(time * 2.4447)) - 1) * 0.01;


            if(!respawnLines && scene.fog.density > 0){
                scene.fog.density *= 0.95;
            }

            starSystem.rotation.x += timePassed * 0.01;
            starSystem.rotation.z -= timePassed * 0.1;

            if(aberration > 0){
                aberration = Math.max(0, aberration - timePassed * 0.03);
                effectPass.uniforms.aberration.value = aberration;
            }

        },
        onEvent: function(event) {
            if(event.instrument){
                if(event.instrument == 1 && event.note == 'D-3'){
                    scaling = 1;
                }
                if(respawnLines && event.instrument == 1 && event.note == 'C-3'){
                    rotSpeed = 1;
                    aberration = 0.005;
                }
            }
            if(event.pattern){
                rotSpeed = 2.2;
                if(brightness == 0 && respawnLines){
                    brightness = 0.2;
                    aberration = 0.01;
                }
                if(event.pattern == 16){
                    respawnLines = false;
                }
            }
        }
    };

    function createLineSystem(systemSize, systemLength) {
        var r = Random(33);
        return _.reduce(_.range(1, 2000), function (memo) {
            var line = new THREE.Mesh(
                new THREE.CubeGeometry(0.1, 0.1, 15),
                new THREE.LineBasicMaterial({color: 0xFFFFFF})
            );

            do {
                var pos = new THREE.Vector3(
                    r.randFloat(-systemSize, systemSize),
                    r.randFloat(-systemSize, systemSize),
                    0
                );
            } while (pos.distanceTo(camera.position) < 15);

            pos.z = r.randFloat(-systemLength, 0);

            line.position = pos;

            memo.add(line);
            return memo;
        }, new THREE.Object3D());
    }

});