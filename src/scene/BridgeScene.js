define(function(){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 5000);

    var tex = [
        THREE.ImageUtils.loadTexture("images/speissship.jpg"),
        THREE.ImageUtils.loadTexture("images/speissship2.jpg"),
        THREE.ImageUtils.loadTexture("images/speissship3.jpg")
    ];

    var screen = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({
            map: tex[0]
        })
    );

    scene.add(screen);

    var title = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 2),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/titles/title-05.png"),
            transparent: true,
            depthWrite: false
        })
    );
    title.position.set(4.1, 2, 0.1)

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
        },
        onEvent: function(ev){
            if(ev.note && ev.instrument == 1 && (ev.note == 'C-3' || ev.note == 'D-3')){
                screen.material.map = tex[texPos = (texPos + 1) % tex.length]
            }
        }
    }

});