require(["Loader", "renderer", "MusicPlayer", "timeline"], function(Loader, Renderer, MusicPlayer, Timeline){
    Loader.onLoaded(function(){
        Renderer.init();
        Timeline.setRenderer(Renderer.renderer);
        Renderer.setTimeLine(Timeline);
        Renderer.setTimeSource(MusicPlayer);
        Renderer.prerender();
        MusicPlayer.start(getPattern());
        Renderer.start();
    });

    function getPattern() {
        var res = location.hash.match(/pattern=([0-9].*)/);
        var pattern = null;
        if (res) {
            pattern = res[1];
        }
        return pattern;
    }
});
