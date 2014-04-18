define(function(require){
    var StarSystem = require("component/starfield");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);
    camera.position.set(3, -2, 10);
    camera.lookAt(new THREE.Vector3());

    var starField = StarSystem.create(33, 100);

    scene.add(starField);

    var fractures = [];

    var fractureMaterials = _.map([
        "01", "02", "03", "04", "05", "06", "07", "08"
    ], function(nr) {
        return new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("images/greets/greets-"+nr+".png"),
            transparent: true
        });
    });

    var curMaterial = 0;

    var projectile = createProjectile();
    projectile.position.set(0, 0, 15);
    var projectiles = [];

    var fractured;
    var fracturePlane = new THREE.Object3D();
    new THREE.SceneLoader().load("models/Shatter/shatterPlane.js", function(importScene) {
        _.each(importScene.objects, function(object){
            fracturePlane.add(object);
        });
        fractured = createFracturePlane();
    });

    var light = new THREE.PointLight(0xFFFFFF, 10, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    var flash = 0;
    var aberration = 0;

    var triggerProjectile = true;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            camera.position.x -= 0.02;
            camera.lookAt(new THREE.Vector3());

            _.each(fractures, function(obj){
                obj.position.add(obj.moveVector);
                obj.rotation.x += obj.rotVector.x;
                obj.rotation.y += obj.rotVector.y;
                obj.rotation.z += obj.rotVector.z;
            });

            _.each(projectiles, function(projectile){
                projectile.position.z -= 1;
                if(projectile.position.z < 0 && projectile.active) {
                    projectile.active = false;
                    flash = 1;
                    _.map(fractured.children, function(object){
                        fractures.push(object);
                        object.rotVector = new THREE.Vector3(
                            (Math.random() - 0.5) * 0.1,
                            (Math.random() - 0.5) * 0.1,
                            (Math.random() - 0.5) * 0.1
                        );
                        object.moveVector = _.clone(object.position);
                        object.moveVector.multiplyScalar(0.05);
                        object.moveVector.z = -object.position.distanceTo(projectile.position) * 0.05;
                    });
                }
            })
            effectPass.uniforms.brightness.value = 0.3 * flash;
            flash = Math.max(0, flash - 0.1);

            effectPass.uniforms.aberration.value = 0.002 * aberration;
            aberration = Math.max(0, aberration - 0.1);
        },
        onEvent: function(event){
            if(event.instrument == 1 && event.note == 'D-3'){
                if(triggerProjectile){
                    var p = projectile.clone();
                    p.active = true;
                    projectiles.push(p);
                    scene.add(p);
                } else {
                    curMaterial++;
                    if(fractureMaterials.length > curMaterial){
                        fractured = createFracturePlane();
                        if(curMaterial == 4) {
                            fractured.traverse(function(obj){ obj.visible = false; });
                        }
                    }
                }

                triggerProjectile = !triggerProjectile;
            }
            if(event.instrument == 1 && event.note == 'C-3'){
                aberration = 1;
            }
            if(event.pattern == 23){
                fractured.traverse(function(obj){ obj.visible = true; });
            }
        }
    };

    function createProjectile() {
        var projectile = new THREE.Object3D();
        projectile.add(new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 3),
            new THREE.MeshBasicMaterial({
                color: 0xFF0000,
                transparent: true,
                blending: THREE.AdditiveBlending
            })
        ));
        projectile.add(new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.05, 2.95),
            new THREE.MeshBasicMaterial({
                color: 0xFFFFF
            })
        ));
        return projectile;
    }


    function createFracturePlane() {
        var fractured = fracturePlane.clone();
        _.each(fractured.children, function (obj) {
            obj.material = fractureMaterials[curMaterial];
        });
        scene.add(fractured);
        return fractured;
    }
})