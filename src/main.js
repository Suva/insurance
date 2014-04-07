require(["Loader", "renderer", "MusicPlayer"], function(Loader, Renderer, MusicPlayer){

    Loader.onLoaded(function(){
        Renderer.init();
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
