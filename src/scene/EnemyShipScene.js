define(function(require){
    var StarSystem = require("component/starfield");
    var Timer = require("Timer");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10000);
    var loader = new THREE.JSONLoader(true);
    var origin = new THREE.Vector3();
    var starField = StarSystem.create(33, 100);

    var leftTurretPosition = new THREE.Vector3(3.195, -0.2, -2);
    var rightTurretPosition = new THREE.Vector3(-3.195, -0.2, -2);

    scene.add(starField);

    camera.position.set(-5, 5, 8);
    camera.lookAt(origin);

    var projectiles = [];

    var projectile = createProjectile();

    var leftTurretLight = new THREE.PointLight(0xFF0000, 2, 3);
    leftTurretLight.position.x = -1000;

    var rightTurretLight = leftTurretLight.clone();
    rightTurretLight.position.x = -1000;

    var ship;
    loader.load("models/spaceship-five.js", function(geometry, materials){
        materials[1].bumpMap.bumpScale = 0.0001;
        ship = new THREE.Object3D();
        ship.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));

        var tailLight = new THREE.PointLight(0xCCCCFF, 2, 3);
        tailLight.position.set(0, 0, 5.2);
        ship.add(tailLight);

        ship.rotation.y = -1.5;

        scene.add(ship);

        ship.add(leftTurretLight);
        ship.add(rightTurretLight);
    });

    var light = new THREE.PointLight(0xFFFFFF, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    var projectileSpeed = 50;

    var timer = new Timer(),
        stage2Timer = new Timer(),
        aberration = 0,
        flash = 0,
        stage = 0;

    function render(time) {
        var passed = timer.getPassed(time);

        if(stage == 0){
            ship.rotation.y -= 0.22 * passed;
            starField.rotation.z += 0.05 * passed;
            starField.rotation.y += 0.1 * passed;
            camera.position.y += passed * 0.5;
            camera.position.z += passed;
        }

        if(stage == 1){
            var passedS1 = stage2Timer.getPassed(time);
            camera.position.set(-5, 5 - stage2Timer.getTime(time) * 0.5, 8);
            console.log(passedS1);
            starField.rotation.z += 0.05 * passedS1;
            starField.rotation.y -= 0.1 * passedS1;
            ship.rotation.y = (Math.PI / 2) + stage2Timer.getTime(time) * 0.15;
            camera.lookAt(ship.position);

        }

        projectiles = _.filter(projectiles, function(projectile){
            projectile.position.z -= passed * projectileSpeed;
            if(projectile.position.z < -300){
                ship.remove(projectile);
                return false;
            }
            return true;
        });

        effectPass.uniforms.aberration.value = 0.002 * aberration;
        aberration = Math.max(0, aberration - 0.1);

        effectPass.uniforms.brightness.value = 0.3 * flash;
        flash = Math.max(0, flash - 0.1);
    }

    var useLeftTurret = true;
    function onEvent(event) {
        if(event.instrument == 1 && (event.note == 'D-3' || event.note == 'C-3')){
            var p = projectile.clone();

            p.position = useLeftTurret ? leftTurretPosition.clone() : rightTurretPosition.clone();
            projectiles.push(p);
            ship.add(p);
            if(useLeftTurret)
                leftTurretLight.position = p.position;
            else
                rightTurretLight.position = p.position;
            useLeftTurret = !useLeftTurret;
            aberration = 1;
            if(event.note == 'D-3') {
                flash = 1;
            }
        }

        if(event.pattern == 20){
            stage = 1;
            flash = 2;
        }
    }

    return {
        scene: scene,
        camera: camera,
        render: render,
        onEvent: onEvent
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
});