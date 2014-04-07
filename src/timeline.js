define(function(require) {
    var CargoRoomScene = require("scene/CargoRoomScene");
    var SaturnScene    = require("scene/SaturnScene");
    var BridgeScene    = require("scene/BridgeScene");

    var currentScene = null;
    return {
        getScene: function(){
            return currentScene;
        },
        onEvent: function(event){
            if(typeof(event.pattern) == 'undefined') return;
            switch(event.pattern){
                case 0:
                    currentScene = SaturnScene;
                    break;
                case 4:
                    currentScene = CargoRoomScene;
                    break;
                case 5:
                    currentScene = BridgeScene;
                    break;
                case 6:
                    currentScene = SaturnScene;
                    break;
            }
        }
    }
});