require(["renderer"], function(Renderer){

    Renderer.init();
    Renderer.setTimeSource(createDummyTimeSource());
    Renderer.start();

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