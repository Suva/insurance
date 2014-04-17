define(function(require){
    var scene = new THREE.Object3D();
    var camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 5000);

    var screenPosition = new THREE.Vector3(-4.9, 1.4, 2.5);

    var Timer = require("Timer");
    var Ease = require("ease");

    var jsonLoader = new THREE.JSONLoader();
    var girlPlaneMat;
    var building;
    jsonLoader.load("models/teleporter.js", function(geometry, materials) {
        girlPlaneMat = materials[2];
        girlPlaneMat.opacity = 0;
        building = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(building);
    });

    var origin = new THREE.Vector3(0, 4, 0);
    var startVector = new THREE.Vector3(0, 3, 20);
    var endVector = screenPosition.clone();
    endVector.z += 4.1;
    endVector.y += 1.8;
    endVector.x += 0.7;

    camera.position.set(0, 3, 20);

    var light = new THREE.PointLight(0x00FF00, 0.8, 20);
    light.position.set(-10, 6, 12);
    scene.add(light);

    var light2 = new THREE.PointLight(0x0000FF, 0.8, 20);
    light.position.set(10, 6, 12);
    scene.add(light2);

    var light3 = new THREE.PointLight(0x6666FF, 0.4, 30);
    scene.add(light3);

    var strobe = new THREE.PointLight(0x6666FF, 0, 100);
    strobe.position.set(0, 0, 30);
    scene.add(strobe);

    var ultrastrobe = new THREE.PointLight(0xFFFFFF, 0, 100);
    scene.add(ultrastrobe);

    var lightningTextures = _.map(_.range(0, 6), function(idx){
        return THREE.ImageUtils.loadTexture("images/lightning/lightning-0"+(idx + 1)+".png");
    });

    var lightningPlanes = _.map(_.range(0, 100), function(){
        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(0.875, 7),
            new THREE.MeshBasicMaterial({
                map: lightningTextures[0],
                transparent: true,
                opacity: 0,
                depthWrite: false
            })
        );
        plane.position.set(Math.random() - 0.5, 0, Math.random() - 0.5);
        plane.position.normalize();
        plane.position.multiplyScalar(1.3);
        plane.position.y = 3;
        scene.add(plane);
        return plane;
    });


    var timer = new Timer();
    var hue = 0;
    var position = 0;
    var randomVector = new THREE.Vector3();
    var phase = 0;
    var fadeInGirl = false;
    var fadeToWhite = false;

    return {
        scene: scene,
        camera: camera,
        render: function(time){
            var passed = timer.getPassed(time);
            camera.lookAt(screenPosition);

            randomVector.x = Math.max(-0.3, Math.min(0.3, randomVector.x + (Math.random() - 0.5) * 0.001));
            randomVector.y = Math.max(-0.3, Math.min(0.3, randomVector.y + (Math.random() - 0.5) * 0.001));
            randomVector.z = Math.max(-0.3, Math.min(0.3, randomVector.z + (Math.random() - 0.5) * 0.001));

            if(phase == 1){
                var easedPosition = Ease.inOutCubic(position);
                camera.position =
                    endVector.clone().multiplyScalar(easedPosition).add(
                        startVector.clone().multiplyScalar(1 - easedPosition)
                    ).add(randomVector);
                position = Math.min(1, position + passed * 0.3);
            }

            light3.position = camera.position;
            light3.color.setHSL(hue, 1, 0.5);
            hue += passed * 0.1;
            if(hue > 1) hue = hue -1;

            if(phase == 2){
                _.each(lightningPlanes, function(plane){
                    plane.material.opacity = Math.max(0, plane.material.opacity - passed * 2)
                });
                camera.lookAt(origin);
                camera.position.x += passed * 0.5;
                camera.position.z += passed * 0.1;
                strobe.intensity -= passed * 9;
                if(ultrastrobe.intensity == 0)
                    ultrastrobe.intensity = 0.5;
                else
                    ultrastrobe.intensity = 0;
                ultrastrobe.color.setHSL(Math.random(), 0.5, 0.5)
            }
            if(fadeInGirl){
                girlPlaneMat.opacity += 0.1 * passed;
                if(girlPlaneMat.opacity >= 1) fadeInGirl = false;
            }
            if(fadeToWhite){
                effectPass.uniforms.brightness.value += passed * 0.2;
            }
        },
        onEvent: function(event) {
            if(phase == 2){
                if(event.instrument == 1){
                   _.each(_.range(0, 10), function(){
                       var mat = lightningPlanes[Math.floor(Math.random() * lightningPlanes.length)].material;
                       mat.map = lightningTextures[Math.floor(Math.random() * lightningTextures.length)];
                       mat.opacity = 1;
                   });
                   strobe.intensity = 4;
               }

            }
            if(event.pattern == 40){
                camera.position.set(-10, 3, 10)
                phase++;
            }
            if(event.pattern == 42){
                fadeInGirl = true;
            }

            if(event.pattern == 43){
                fadeToWhite = true;
            }
        },
        init: function(){
            phase++;
            effectPass.uniforms.brightness.value = 0;
            effectPass.uniforms.aberration.value = 0;
        }
    }

});