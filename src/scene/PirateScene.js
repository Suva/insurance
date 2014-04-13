define(function(require){
    var Text = require("component/Text");
    var Timer = require("Timer");
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);

    var screen = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("images/koll.jpg")})
    );

    scene.add(screen);

    camera.position.set(0, 0, 5);
    camera.lookAt(screen.position);

    var text = Text.drawString("you are surrounded", scene, new THREE.Vector3(-3.4, -3, 0));

    var timer = new Timer();
    var phase = 0;

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            camera.position.z -= timer.getPassed(time) * 0.05;
            text.render(time);

            if(timer.getTime(time) > 2 && phase == 0){
                text.destroy();
                text = Text.drawString("lower the shields", scene, new THREE.Vector3(-3, -3, 0));
                phase = 1
            }

            if(timer.getTime(time) > 4 && phase == 1){
                text.destroy();
                text = Text.drawString("and surrender the cargo", scene, new THREE.Vector3(-4, -3, 0));
                phase = 2
            }

        }
    }
});