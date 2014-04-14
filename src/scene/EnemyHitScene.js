define(function(require){
    var Timer = require("Timer");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);

    var StarSystem = require("component/starfield");
    var starField = StarSystem.create(33, 1000);

    var projectiles = [];

    scene.add(starField);


    camera.position.set(0,5,10);
    camera.lookAt(new THREE.Vector3());

    var light = new THREE.PointLight(0xFFFFFF, 2, 200);
    light.position.set(30, 30, 30);
    scene.add(light);

    var spaceship;
    new THREE.JSONLoader().load("models/spaceship-seven.js", function(geometry, materials){
        spaceship = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        spaceship.rotation.y = -Math.PI / 2 + 0.1;
        scene.add(spaceship);
    });

    var projectileSpeed = 120;
    var timer = new Timer();

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            spaceship.rotation.y += passed * 0.1;
            camera.position.x += passed;
            camera.lookAt(spaceship.position);
            _.each(projectiles, function(projectile){
                projectile.position.set(
                    calculateProjectilePosition(projectile.position.x, passed),
                    calculateProjectilePosition(projectile.position.y, passed),
                    calculateProjectilePosition(projectile.position.z, passed)
                )
            })
        },
        onEvent: function(event){
            if(event.instrument == 1 && event.note == 'C-3'){
                var projectile = createProjectile();
                switch (Math.floor(Math.random() * 3)){
                    case 0:
                        projectile.position.set(0, 0, 100);
                        break;
                    case 1:
                        projectile.rotation.y = Math.PI / 2;
                        projectile.position.set(-100, 0, 0);
                        break;
                    case 2:
                        projectile.rotation.y = Math.PI / 2;
                        projectile.position.set(100, 0, 0);
                        break;
                }
                projectiles.push(projectile);
                scene.add(projectile);
            }
        }
    };

    function calculateProjectilePosition(position, time){
        if(position > 0)
            return Math.max(0, position - projectileSpeed * time);
        else
            return Math.min(0, position + projectileSpeed * time);
    }

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
        projectile.scale.multiplyScalar(0.8);
        return projectile;
    }


});