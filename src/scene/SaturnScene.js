define(function(require){
    var StarSystem = require("component/starfield");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 5000);
    camera.lookAt(new THREE.Vector3());

    var starSystem = StarSystem.create(27)
    scene.add(starSystem);
    var light = createLight();
    scene.add(light);

    var camLight = new THREE.PointLight(0xFFFFFF, 1, 50)
    scene.add(camLight);

    new THREE.JSONLoader().load("models/saturn.js", function(geometry, materials){
        var saturn = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        saturn.scale.set(50, 50, 50);
        saturn.position.set(400, 0, -300);
        saturn.castShadow = true;
        saturn.receiveShadow = true;
        scene.add(saturn);
    });

    var spaceship;
    new THREE.JSONLoader().load("models/spaceship-seven.js", function(geometry, materials){
        spaceship = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        spaceship.position.set(0, 0, -10);
        scene.add(spaceship);
    });

    scene.add( createLensFlare() );

    var stage = 0;
    var stage2StartTime = null;
    var curTime = null;
    var startTime = null;
    return {
        scene: scene,
        camera: camera,
        render: function(time){
            if(!startTime) startTime = time;
            curTime = time - startTime;

            if(spaceship){
                spaceship.position.x = -100 + (time - startTime) * 45;

                if(stage == 1){
                    camera.position.set(
                        spaceship.position.x - 10 + (time - stage2StartTime) * 4,
                        spaceship.position.y + 3,
                        spaceship.position.z + 6
                    );
                    camLight.position = camera.position;
                }

                camera.lookAt(spaceship.position);

            }
            starSystem.position = camera.position;

        },
        onEvent: function(event){
            if(event.pattern == 2){
                stage = 1;
                stage2StartTime = curTime;
            }
        }
    };

    function lensFlareUpdateCallback( object ) {

        var f, fl = object.lensFlares.length;
        var flare;
        var vecX = -object.positionScreen.x * 2;
        var vecY = -object.positionScreen.y * 2;


        for( f = 0; f < fl; f++ ) {

            flare = object.lensFlares[ f ];

            flare.x = object.positionScreen.x + vecX * flare.distance;
            flare.y = object.positionScreen.y + vecY * flare.distance;

            flare.rotation = 0;

        }

        object.lensFlares[ 2 ].y += 0.025;
        object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

    }


    function createLight() {
        var light = new THREE.DirectionalLight(0xFFFFFF, 2, 1000);
        light.castShadow = true;
        light.shadowBias = 0.001;
        light.shadowDarkness = 1;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;

        light.position.set(-80, 20, 0);

        return light;
    }

    function createLensFlare() {
        var textureFlare0 = THREE.ImageUtils.loadTexture("images/lensflare/lensflare0.png");
        var textureFlare3 = THREE.ImageUtils.loadTexture("images/lensflare/lensflare3.png");
        var flareColor = new THREE.Color(0xffffff);
        var lensFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor);
        lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);
        lensFlare.customUpdateCallback = lensFlareUpdateCallback;
        lensFlare.position = light.position;
        return lensFlare;
    }

});