define(function(require) {
    var scene2 = require("scene/CargoRoomScene");
    var scene = require("scene/SaturnScene");
    return {
        getScene: function(){
            return scene;
        }
    }
});