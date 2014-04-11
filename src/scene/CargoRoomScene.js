define(function(require){
    var PlasmaShader = require("PlasmaShader"),
        Timer = require("Timer");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
    var cylinderMaterial;
    var cargoRoom;

    var title = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 4),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/titles/title-04.png"),
            transparent: true,
            depthWrite: false
        })
    );
    title.position.x = 4;

    scene.add(title);

    camera.position.z = 90;
    camera.position.x = 4;
    camera.lookAt(new THREE.Vector3());

    var loader = new THREE.JSONLoader(true);
    loader.load("models/cargo-room.js", function(geometry, materials){
        _.each(materials, function(mat, idx){
            if(mat.name == "Material")
                cylinderMaterial = materials[idx] = new THREE.ShaderMaterial(PlasmaShader);

        });
        cargoRoom = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(cargoRoom);
    });

    var light = new THREE.PointLight(0x3366FF, 0.2, 90);
    light.position.set(30, 0, 0);
    var light2 = new THREE.PointLight(0xffbc2b, 0.2, 90);
    light2.position.set(-30, 0, 0);

    var warpLights = new THREE.Object3D();
    _.each([
        new THREE.Vector2(-14, -16),
        new THREE.Vector2(23, -16),
        new THREE.Vector2(-14, 21),
        new THREE.Vector2(23, 21),
        new THREE.Vector2(-14, 59),
        new THREE.Vector2(23, 59)
    ], function(coords){
        var lamp = new THREE.PointLight(0xCCCCFF, 0.4, 60);
        lamp.position.set(coords.x, -6, coords.y);
        warpLights.add(lamp);
    });
    scene.add(warpLights);

    var lightSystem = new THREE.Object3D();

    lightSystem.add(light);
    lightSystem.add(light2);

    scene.add(lightSystem);

    var lightTimer = new Timer();
    var flashTimer = new Timer();

    return {
        scene: scene,
        camera: camera,
        render: function(time){

            effectPass.uniforms.brightness.value = Math.max(0, 1 - flashTimer.getTime(time));

            cylinderMaterial.uniforms._time.value = time;
            cylinderMaterial.needsUpdate = true;

            var passed = lightTimer.getPassed(time);

            lightSystem.rotation.set(time, time, time);
            light.intensity = Math.max(0, light.intensity - passed * 2);
            light2.intensity = Math.max(0, light2.intensity - passed * 2);
            camera.position.z -=  0.2;
            camera.position.x +=  0.0003 * passed;
            camera.rotation.z -=  0.0001 * passed;
            title.position.z += 0.2 * passed;

            if(title.position.distanceTo(camera.position) < 20){
                title.material.opacity = Math.max(0, (title.position.distanceTo(camera.position) - 5) / 15);
            }

            _.each(warpLights.children, function(light){
                light.intensity = (Math.sin(time * 6 + light.position.x) * Math.sin((time + light.position.z + light.position.x) * 7.88)) * 0.1 + 0.5;
            });

            effectPass.uniforms.aberration.value = Math.random() * 0.001;

        },
        onEvent: function(ev){
            if(ev.note && ev.instrument == 1 && ev.note == 'C-3'){
                light.intensity = 2;
            }

            if(ev.note && ev.instrument == 1 && ev.note == 'D-3'){
                light2.intensity = 2;
            }
        }
    }

});