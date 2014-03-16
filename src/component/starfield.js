define(function(require){
    var RandomNumberGenerator = require("random");

    return {
        create: createStarSystem
    };


    function getRandomStarPosition(r) {
        return (r.randInt(0, 1) ? 1 : -1) * (r.random() * 1000);
    }

    function createStarSystem(seed) {
        var origin = new THREE.Vector3();

        var r = RandomNumberGenerator(seed);

        var geo = new THREE.Geometry();
        var colors = [];
        _.each(_.range(1, 5000), function () {
            var vector;
            do {
                vector = new THREE.Vector3(
                    getRandomStarPosition(r),
                    getRandomStarPosition(r),
                    getRandomStarPosition(r)
                );
            } while(origin.distanceTo(vector) < 600)

            geo.vertices.push(vector);
            var color = new THREE.Color(0xffffff);
            color.setHSL(r.random(), 0.5, 0.9);
            colors.push(color);
        });
        geo.colors = colors;
        var sprite = THREE.ImageUtils.loadTexture("images/star.png");
        var particleSystemMaterial = new THREE.ParticleSystemMaterial({
            map: sprite,
            size: 10,
            blending: THREE.AdditiveBlending,
            transparent: true,
            vertexColors: true
        });
        return new THREE.ParticleSystem(geo, particleSystemMaterial);
    }



});