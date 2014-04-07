require(["Loader", "renderer", "MusicPlayer", "Timeline"], function(Loader, Renderer, MusicPlayer, Timeline){
    Loader.onLoaded(function(){
        Renderer.init();
        Renderer.setTimeLine(Timeline);
        Renderer.setTimeSource(MusicPlayer);
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

});;
