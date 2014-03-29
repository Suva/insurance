require(["Manager", "renderer"], function(Manager, Renderer){

    Renderer.init();

    Manager.waitForLoadToComplete(function(){
        Renderer.setTimeSource(createDummyTimeSource());
        Renderer.start();
    });

    function createDummyTimeSource() {
        var startTime = getCurrentTime();
        return {
            getTime: function () {
                var time = getCurrentTime() - startTime;
                return  time;
            }
        };
        function getCurrentTime() {
            return new Date().getTime() / 1000;
        }
    }
});