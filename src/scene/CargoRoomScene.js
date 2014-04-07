define(function(require){
    var PlasmaShader = require("PlasmaShader"),
        Timer = require("Timer");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
    var cylinderMaterial;
    var cargoRoom;


    camera.position.z = 90;
    camera.lookAt(new THREE.Vector3());

    var loader = new THREE.JSONLoader(true);
    loader.load("models/cargo-room.js", function(geometry, materials){
        _.each(materials, function(mat, idx){
            if(mat.name == "Material")
                cylinderMaterial = materials[idx] = new THREE.ShaderMaterial(PlasmaShader);
        });
        cargoRoom = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(cargoRoom);
        console.log(cargoRoom);
    });

    var light = new THREE.PointLight(0x3366FF, 0.4, 200);
    light.position.set(50, 0, 0);
    var light2 = new THREE.PointLight(0xFFFF66, 0.4, 200);
    light.position.set(-50, 0, 0);

    var lightSystem = new THREE.Object3D();

    lightSystem.add(light);
    lightSystem.add(light2);

    scene.add(lightSystem);

    console.log(light);

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
            camera.position.z -=  0.1;
            camera.position.x +=  0.04;
            camera.rotation.z -=  0.001;
        },
        onEvent: function(ev){
            if(ev.note && ev.instrument == 1 && ev.note == 'C-3'){
                console.log(ev);
                light.intensity = 2;
            }

            if(ev.note && ev.instrument == 1 && ev.note == 'D-3'){
                console.log(ev);
                light2.intensity = 2;
            }
        }
    }

});