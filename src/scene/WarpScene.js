define(function(require){
    var Random = require("random");
    var Timer = require("Timer");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 5000);
    scene.fog = new THREE.Fog(0, 10, 200);

    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3());

    var lineSystem = createLineSystem(80, 215);
    scene.add(lineSystem);

    var lineTimer = new Timer();
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var timePassed = lineTimer.getPassed(time);
            _.each(lineSystem.children, function(line){
                line.position.z += timePassed * 200;
                if(line.position.z > 15) {
                    line.position.z -= 215;
                }
            });
            lineSystem.rotation.z += timePassed * 0.05;
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