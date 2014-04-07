define(function(){
    var startTime = 0;


    return {
        start: function(){
            startTime = getCurrentTime();
        },
        getTime: function () {
            return getCurrentTime() - startTime;
        },
        getEvents: function(){
            return [];
        }
    };

    function getCurrentTime() {
        return new Date().getTime() / 1000;
    }
});