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
        var particleGeo = _.reduce(_.range(0, 300), function (geo) {
            geo.vertices.push(new THREE.Vector3(0, 0, 0));
            return geo;
        }, new THREE.Geometry());
        var particleSystem = new THREE.ParticleSystem(
            particleGeo,
            new THREE.ParticleSystemMaterial({
                color: 0xFFFFFF,
                size: 0.3,
                map: sparkTexture,
                transparent: true,
                depthWrite: false
            })
        );
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

    var spaceship, shield;
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load("models/spaceship-seven.js", function(geometry, materials){
        spaceship = new THREE.Object3D();
        spaceship.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));
        jsonLoader.load("models/spaceship-shield.js", function(geometry, materials){
            shield = new THREE.Mesh(geometry, materials[0]);
            spaceship.add(shield);
        });
        spaceship.rotation.y = -Math.PI / 2 + 0.1;
        scene.add(spaceship);
    });

    var projectileSpeed = 120;
    var timer = new Timer();
    var aberration = 0;
    var flash = 0;

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            spaceship.rotation.y += passed * 0.1;
            camera.position.x += passed;
            camera.lookAt(spaceship.position);
            projectiles = _.filter(projectiles, function(projectile){
                projectile.position.set(
                    calculateProjectilePosition(projectile.position.x, passed),
                    calculateProjectilePosition(projectile.position.y, passed),
                    calculateProjectilePosition(projectile.position.z, passed)
                );
                if(projectile.position.distanceTo(spaceship.position) < 2){
                    shield.material.opacity = 1;
                    flash = 1;

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
                            .multiplyScalar(0.1);
                    });

                    scene.remove(projectile);
                    return false;
                }
                return true;
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
            if(event.instrument == 1 && (event.note == 'C-3' || event.note == 'C-3')){
                aberration = 1;
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