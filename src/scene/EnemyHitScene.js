define(function(require){
    var Timer = require("Timer");

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);

    var StarSystem = require("component/starfield");
    var starField = StarSystem.create(33, 1000);

    var projectiles = [];

    scene.add(starField);

    var sparkTexture = THREE.ImageUtils.loadTexture("images/spark.png");

    function createParticleSystem() {
        var particleMat = new THREE.ParticleSystemMaterial({
            color: 0xFFFFFF,
            size: 0.3,
            map: sparkTexture,
            transparent: true,
            depthWrite: false
        });
        particleMat.color.setRGB(3, 3, 3);

        var particleGeo = _.reduce(_.range(0, 300), function (geo) {
            geo.vertices.push(new THREE.Vector3(0, 0, 0));
            return geo;
        }, new THREE.Geometry());
        var particleSystem = new THREE.ParticleSystem(particleGeo, particleMat);
        particleSystem.sortParticles = true;
        return particleSystem;
    }

    var particleSystems = _.map(_.range(0, 10), function(){
        var ps = createParticleSystem();
        scene.add(ps);
        return ps;
    });

    var currentSystem = 0;

    camera.position.set(0,5,10);
    camera.lookAt(new THREE.Vector3());

    var light = new THREE.PointLight(0xFFFFFF, 2, 200);
    light.position.set(30, 30, 30);
    scene.add(light);

    var missileTailLight = new THREE.PointLight(0xaaaaFF, 15, 3);
    missileTailLight.position.set(10000, 0, 0);
    scene.add(missileTailLight);

    var spaceship, shield;
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load("models/spaceship-seven.js", function(geometry, materials){
        spaceship = new THREE.Object3D();
        spaceship.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));
        jsonLoader.load("models/spaceship-shield.js", function(geometry, materials){
            materials[0].color.setRGB(1, 1, 3);
            shield = new THREE.Mesh(geometry, materials[0]);
            spaceship.add(shield);
        });
        spaceship.rotation.y = -Math.PI / 2 + 0.1;
        scene.add(spaceship);
        spaceship.moveVector = new THREE.Vector3();
    });

    var missiles = [];
    var curMissile = 0;

    jsonLoader.load("models/missile.js", function(geometry, materials) {
        var missile = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

        missile.rotation.y = Math.PI;
        missile.position.y = -0.83;
        missile.scale.multiplyScalar(0.1);

        missiles.push(missile);
        missiles.push(missile.clone());
        missiles.push(missile.clone());

        _.each(missiles, function(missile){
            scene.add(missile);
        })

    });

    var projectileSpeed = 120;
    var missileSpeed = 20;
    var timer = new Timer();
    var aberration = 0;
    var flash = 0;
    var phase = 0;

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);

            if(phase < 2){
                spaceship.rotation.y += passed * 0.1;
                camera.position.x += passed;
                camera.lookAt(spaceship.position);
            } else {
                camera.position.x += passed;
                camera.lookAt(spaceship.position);
                spaceship.rotation.x += spaceship.moveVector.x;
                spaceship.rotation.y += spaceship.moveVector.y;
                spaceship.rotation.z += spaceship.moveVector.z;

                spaceship.moveVector.multiplyScalar(0.999);
            }

            projectiles = _.filter(projectiles, function(projectile){
                projectile.position.set(
                    calculateProjectilePosition(projectile.position.x, passed),
                    calculateProjectilePosition(projectile.position.y, passed),
                    calculateProjectilePosition(projectile.position.z, passed)
                );
                if(projectile.position.distanceTo(spaceship.position) < 2){
                    if(phase == 1)
                        shield.material.opacity = 1;

                    if(phase == 2) {
                        if(projectile.position.x < 0){
                            spaceship.moveVector.y += 0.01
                        }
                        else if(projectile.position.x > 0){
                            spaceship.moveVector.y -= 0.01
                        } else {
                            spaceship.moveVector.x += 0.01
                        }
                    }

                    if(phase == 2){
                        aberration = 2;
                        flash += 2.5;
                    } else {
                        flash = 1;
                    }

                    var particleSystem = particleSystems[currentSystem];
                    particleSystem.active = true;
                    particleSystem.position = _.clone(projectile.position)
                    particleSystem.material.opacity = 1;
                    currentSystem = (currentSystem + 1) % particleSystems.length;

                    _.each(particleSystem.geometry.vertices, function(vert){
                        vert.set(0, 0, 0);
                        vert.direction = particleSystem.position.clone()
                            .add(new THREE.Vector3(
                                    (Math.random() - 0.5) * 3,
                                    (Math.random() - 0.5) * 3,
                                    (Math.random() - 0.5) * 3
                                )
                            )
                            .normalize()
                            .multiplyScalar(Math.random() * 0.3 + 0.3);
                    });

                    scene.remove(projectile);
                    return false;
                }
                return true;
            });

            _.each(missiles, function(missile){
                if(missile.active){
                    missile.position.z += passed * missileSpeed;
                    missileTailLight.position.set(
                        missile.position.x,
                        missile.position.y,
                        missile.position.z - 1.28
                    );
                }
            });

            shield.material.opacity = Math.max(0, shield.material.opacity - passed * 2);
            effectPass.uniforms.aberration.value = 0.002 * aberration;
            aberration = Math.max(0, aberration - 0.1);

            effectPass.uniforms.brightness.value = 0.3 * flash;
            flash = Math.max(0, flash - 0.1);

            _.each(particleSystems, function(ps){
                if(ps.active) {
                    _.each(ps.geometry.vertices, function(vert){
                        vert.add(vert.direction);
                    });
                    ps.geometry.verticesNeedUpdate = true;
                    ps.material.opacity = Math.max(0, ps.material.opacity - passed * 0.1);
                    if(ps.material.opacity == 0){ ps.active = false; }
                }
            });
        },
        onEvent: function(event){
            if(event.instrument == 1 && (event.note == 'C-3')){
                if(phase == 1 || curMissile == 3) {
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
            if(event.instrument == 1 && (event.note == 'C-3' || event.note == 'D-3')){
                aberration = 1;

                if(phase == 2 && curMissile < missiles.length && event.note == 'D-3'){
                    var missile = missiles[curMissile++];
                    aberration = 3;
                    flash = 0.2;
                    missile.traverse(function(obj){ obj.visible = true; });
                    missile.active = true;
                }

            }
        },
        init: function(){
            _.each(missiles, function(missile) { missile.visible = false; });

            phase++;
            if(phase == 2){
                timer = new Timer();
                projectiles = _.filter(projectiles, function(projectile){
                    scene.remove(projectile);
                    return false;
                });
                camera.position.set(3,-3,10);
                camera.lookAt(new THREE.Vector3());
                spaceship.rotation.y = -Math.PI / 2;
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