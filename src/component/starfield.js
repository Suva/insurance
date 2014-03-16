define(function(require){
    var RandomNumberGenerator = require("random");

    var r = RandomNumberGenerator(33);

    return {
        create: createStarSystem
    };

    function getRandomStarPosition() {
        return (r.randInt(0, 1) ? 1 : -1) * r.random() * 900 + 100;
    }

    function createStarSystem() {
        var geo = new THREE.Geometry();
        var colors = [];
        _.each(_.range(1, 5000), function () {
            geo.vertices.push(new THREE.Vector3(
                getRandomStarPosition(),
                getRandomStarPosition(),
                getRandomStarPosition()
            ));
            var color = new THREE.Color(0xffffff);
            color.setHSL(Math.random(), 0.5, 0.9);
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