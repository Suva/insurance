require(["renderer", "scene/LogoScene"], function(Renderer, LogoScene){

    Renderer.init();
    Renderer.setTimeSource(createDummyTimeSource());
    Renderer.setScene(LogoScene);
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