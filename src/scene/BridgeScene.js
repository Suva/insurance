define(function(require){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 5000);
    var StarSystem = require("component/starfield");

    var screen = new THREE.Object3D();
    var layer1 = new THREE.Mesh(
        new THREE.PlaneGeometry(13.5, 9),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/cockpit_01.png"),
            transparent: true
        })
    );

    var layer2 = new THREE.Mesh(
        new THREE.PlaneGeometry(13.5, 9),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/cockpit_02.png"),
            transparent: true
        })
    );
    layer2.position.z = 0.1;

    var layer3 = new THREE.Mesh(
        new THREE.PlaneGeometry(13.5, 9),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/cockpit_03.png"),
            transparent: true
        })
    );
    layer3.position.z = 0.2;

    var layer4 = new THREE.Mesh(
        new THREE.PlaneGeometry(13.5, 9),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/cockpit_04.png"),
            transparent: true
        })
    );
    layer4.position.z = 0.3;

    screen.add(layer1);
    screen.add(layer2);
    screen.add(layer3);
    screen.add(layer4);

    var starfield = StarSystem.create(33);
    scene.add(starfield);

    scene.add(screen);

    var title = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 2),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/titles/title-05.png"),
            transparent: true,
            depthWrite: false
        })
    );
    title.position.set(4.1, -2, 0.1)

    scene.add(title);

    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3());

    var texPos = 0;

    return {
        scene: scene,
        camera: camera,
        render: function(time){
             camera.rotation.x -= 0.0001;
             screen.rotation.z += 0.0001;
             title.position.z += 0.001;
             title.position.x -= 0.001;
             title.position.y -= 0.001;
             layer2.position.x += 0.001;
             starfield.position.x -= 3;

        },
        onEvent: function(ev){
            if(ev.note && ev.instrument == 1 && (ev.note == 'C-3' || ev.note == 'D-3')){
            }
        }
    }

});