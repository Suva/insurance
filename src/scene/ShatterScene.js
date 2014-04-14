define(function(){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3());

    var objs = [];


    var fractured = new THREE.Object3D();
    new THREE.SceneLoader().load("models/Shatter/testFracture.js", function(importScene) {
        _.each(importScene.objects, function(object){
            fractured.add(object);
            objs.push(object);
            object.rotVector = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
        });
        scene.add(fractured);
    });

    var light = new THREE.PointLight(0xFFFFFF, 10, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scattering = false;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            if(scattering){

                _.each(objs, function(obj){
                    obj.position.multiplyScalar(1.01);

                    obj.rotation.x += obj.rotVector.x;
                    obj.rotation.y += obj.rotVector.y;
                    obj.rotation.z += obj.rotVector.z;

                })
            }
        }
    };
})