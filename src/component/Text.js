define(function(require){
    var Timer = require("Timer");

    var charTextures = _.map(_.range(1, 27), function(idx){
        return THREE.ImageUtils.loadTexture("images/alphabet/"+idx+".png")
    });

    return {
        drawChar: drawChar,
        drawString: drawString
    }

    function drawChar(char, scene, position){
        var charCode = char.charCodeAt(0) - 97;
        var obj = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: charTextures[charCode],
                transparent: true
            })
        );

        obj.position = position;
        scene.add(obj);
        return obj;
    }

    function drawString(string, scene, position){
        var pos = 0;
        var charScale = 0.4;

        var timer = new Timer();
        var charStep = 0.05;
        var renderedChar = null;
        var chars = [];
        var fadeOut = false;

        return {
            render: function (time){
                var t = timer.getTime(time);
                var p = timer.getPassed(time);

                var charNumber = Math.floor(t/charStep);

                if(charNumber != renderedChar && charNumber < string.length){
                    var char = string[charNumber];
                    if(char != " ") {
                        var obj = drawChar(char, scene, new THREE.Vector3(position.x + pos, position.y, position.z));
                        chars.push(obj);
                    }
                    pos += charScale;
                    renderedChar = charNumber;
                }

                if(fadeOut){
                    _.each(chars, function(obj){
                        obj.material.opacity = Math.max(0, obj.material.opacity - p);
                    });
                }

                _.each(chars, function(obj){
                    var scale = obj.scale.x;
                    if(scale > charScale)
                        obj.scale.multiplyScalar(0.90);
                })
            },
            destroy: function(){
                _.each(chars, function(obj){
                    scene.remove(obj);
                })
            },
            setCharScale: function(scale){
                charScale = scale;
            },
            fadeOut: function(){
                fadeOut = true;
            }
        }
    }
});