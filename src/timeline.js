define(function(require) {
    var CargoRoomScene = require("scene/CargoRoomScene");
    var SaturnScene    = require("scene/SaturnScene");

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
                case 8:
                    currentScene = CargoRoomScene;
                    break;
            }
        }
    }
});