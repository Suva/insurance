require(["Loader", "renderer", "TimelineSingle", "TimeSourceDebug"], function(Loader, Renderer, TimeLine, TimeSource){
    Loader.onLoaded(function(){
        Renderer.init();
        Renderer.setTimeLine(TimeLine);
        Renderer.setTimeSource(TimeSource);
        TimeSource.start();
        Renderer.start();
    });

});
