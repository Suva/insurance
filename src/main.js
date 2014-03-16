require(["renderer", "scene/Space"], function(Renderer, SpaceScene){

    Renderer.init();
    Renderer.setTimeSource(createDummyTimeSource());
    Renderer.setScene(SpaceScene);
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