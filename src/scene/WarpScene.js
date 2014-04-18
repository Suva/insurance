define(function(require){
    var Random = require("random");
    var Timer = require("Timer");
    var Text = require("component/Text");
    var Ease = require("ease");
    var Starfield = require("component/starfield");
    var renderScene = null;

    var chars = [];

    var scaling = 0;
    var rotSpeed = 0;
    var respawnLines = true;
    var brightness = 1;
    var aberration = 0;

    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 5000);

    camera.position.set(3, 2, 3);
    camera.lookAt(new THREE.Vector3(0, 0, -8));

    var lineSystem = createLineSystem(80, 215);
    scene.add(lineSystem);

    var loader = new THREE.JSONLoader();
    var spaceship;
    loader.load("models/spaceship-seven.js", function(geometry, materials){
        var spaceshipObj = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        spaceshipObj.rotation.y = Math.PI / 2;
        spaceship = new THREE.Object3D();
        spaceship.position.set(0, 0, -3);
        spaceship.add(spaceshipObj);
        scene.add(spaceship);
    });

    var fleet;
    var leadShip;
    loader.load("models/spaceship-five.js", function(geometry, materials){
        var ship;
        materials[1].bumpMap.bumpScale = 0.0001;
        ship = new THREE.Object3D();
        ship.add(new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)));

        var tailLight = new THREE.PointLight(0xCCCCFF, 2, 3);
        tailLight.position.set(0, 0, 5.2);
        ship.add(tailLight);

        ship.rotation.y = Math.PI;
        ship.scale.multiplyScalar(0.4);

        fleet = new THREE.Object3D();
        _.each(_.range(0, 3), function(idx){
            var shipCopy = ship.clone();
            shipCopy.position.x = (idx - 1) * 10;
            shipCopy.position.z = -10;
            if(idx != 1) {
                shipCopy.position.z -= 5;
                shipCopy.direction = new THREE.Vector3((idx - 1) * 0.1, 0, 1);
            } else {
                leadShip = shipCopy;
                shipCopy.position.y += 1;
                shipCopy.direction = new THREE.Vector3(0, 0.03, 1);
            }
            fleet.add(shipCopy);
        });

        scene.add(fleet);
    });

    var starSystem = Starfield.create(33);
    scene.add(starSystem);

    var light = new THREE.PointLight(0xFFFFFF, 1, 200);
    light.position = camera.position;
    scene.add(light);

    var randomColors = false;
    var lineTimer = new Timer();
    var textTimer = new Timer();
    var showText = true;
    var textString = [
        "this warp field is brought to you by cybercat corporation",
        "warp fields for every taste and need",
        "just contact your nearest cybercat dealer for special offers",
        "     ",
        "code",
        "music",
        "modelling",
        "by",
        "c l y    s u v a",
        "     ",
        "concept art",
        "graphics",
        "v a s t i q u e",
        "     ",
        "no cats were harmed during the making of this demo",
        "so are you enjoying this warp field",
        "please provide feedback",
        "our customer needs are most important to us",
        "oh right",
        "we detected a warp cancellation field approaching",
        "looks like you are about to fall out of warp",
        "sorry about that",
        "you should have bought our warp cancellation field cancellation package"
    ].join("     ");

    _.each(textString, function(char, idx){
        if(char != " "){
            var charObj = Text.drawChar(char, scene, new THREE.Vector3(0, 0, -200 - (idx)));
            charObj.scale.multiplyScalar(2);
            chars.push(charObj);
        }
    })

    var oldCharPos = null;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var timePassed = lineTimer.getPassed(time);

            if(showText){
                _.each(chars, function(char){
                    char.position.z += timePassed * 20;
                    char.position.x = Math.sin(char.position.z * 0.06 + 4) * 30;
                    char.position.y = Math.sin(char.position.z * 0.06) * 15;
                    char.material.opacity = Math.min(1, Math.max(0, (char.position.z + 200) / 100));
                    if(char.position.z > 0){
                        scene.remove(char);
                    }
                });
            }

            if(brightness > 0){
                brightness = Math.max(0, brightness - timePassed);
                effectPass.uniforms.brightness.value = Ease.outQuad(brightness);
            }

            if(scaling > 0) {
                scaling = Math.max(0, scaling - timePassed);
            }
            var scale = 1 + Ease.inQuint( scaling ) * 6;
            _.each(lineSystem.children, function(line){
                line.position.z += timePassed * 200;
                if(scaling > 0){
                    line.scale.set(scale, scale, 1);
                }

                if(respawnLines && line.position.z > 15) {
                    line.position.z -= 215;
                    if(randomColors){
                        line.material.color.setHSL(Math.random(), 1, 0.8);
                    }
                }
            });

            light.intensity = 1 + Ease.inQuint( scaling );

            lineSystem.rotation.z += timePassed * 0.05 + Ease.inOutCubic(rotSpeed) * timePassed;
            rotSpeed = Math.max(0, rotSpeed - timePassed * 3);

            spaceship.position.y =
                (Math.sin(time / 3.752) * Math.sin(time) * Math.sin(time * 2.11))* 0.2;

            spaceship.position.z =
                -3 +
                (Math.sin(time / 3.6) * Math.sin(time / 1.3) * Math.sin(time / 4.22)) * 0.5;


            spaceship.rotation.z =
                ((Math.sin(time / 1.8884) * Math.sin(time) * Math.sin(time * 2.4447)) - 1) * 0.01;


            if(!respawnLines && renderScene.fog.density > 0){
                renderScene.fog.density *= 0.95;
            }

            if(!respawnLines){
                _.each(fleet.children, function(ship){
                    ship.position.add(ship.direction);
                })

                camera.lookAt(leadShip.position);
            }

            starSystem.rotation.x += timePassed * 0.01;
            starSystem.rotation.z -= timePassed * 0.1;

            if(aberration > 0){
                aberration = Math.max(0, aberration - timePassed * 0.03);
                effectPass.uniforms.aberration.value = aberration;
            }

            if(leadShip.position.z > 0 && lineSystem.visible){
                lineSystem.traverse(function(obj) { obj.visible = false; });
            }

        },
        onEvent: function(event) {
            if(event.instrument){
                if(event.instrument == 1 && event.note == 'D-3'){
                    scaling = 1;
                }
                if(respawnLines && event.instrument == 1 && event.note == 'C-3'){
                    if(rotSpeed < 1) rotSpeed = 1;
                    aberration = 0.005;
                }
            }
            if(event.pattern){
                rotSpeed = 2.2;
                if(brightness == 0 && respawnLines){
                    brightness = 0.5;
                    aberration = 0.01;
                }
                if(event.pattern == 10){
                    showText = true;
                }
                if(event.pattern == 12){
                    randomColors = true;
                }
                if(event.pattern == 16){
                    respawnLines = false;
                    fleet.traverse(function(obj){ obj.visible = true });
                }
            }

        },
        init: function(args){
            renderScene = args.renderScene;
            renderScene.fog.density = 0.008;
            fleet.traverse(function(obj){ obj.visible = false });
            _.each(fleet.children, function(ship){
                ship.position.z = -200;
            })
        }
    };

    function createLineSystem(systemSize, systemLength) {
        var r = Random(33);
        return _.reduce(_.range(1, 2000), function (memo) {
            var line = new THREE.Mesh(
                new THREE.CubeGeometry(0.1, 0.1, 15),
                new THREE.LineBasicMaterial({color: 0xFFFFFF})
            );

            do {
                var pos = new THREE.Vector3(
                    r.randFloat(-systemSize, systemSize),
                    r.randFloat(-systemSize, systemSize),
                    0
                );
            } while (pos.distanceTo(camera.position) < 15);

            pos.z = r.randFloat(-systemLength, 0);

            line.position = pos;

            memo.add(line);
            return memo;
        }, new THREE.Object3D());
    }

});