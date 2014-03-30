define(function(require) {
    var CargoRoomScene = require("scene/CargoRoomScene");
    var SaturnScene    = require("scene/SaturnScene");
    var LogoScene      = require("scene/LogoScene");

    var currentScene = null;
    return {
        getScene: function(){
            return currentScene;
        },
        onEvent: function(event){
            if(typeof(event.pattern) == 'undefined') return;
            console.log(event.pattern);
            switch(event.pattern){
                case 0:
                    currentScene = SaturnScene;
                    break;
                case 4:
                    currentScene = LogoScene;
                    break;
                case 8:
                    currentScene = CargoRoomScene;
                    break;
            }
        }
    }
});