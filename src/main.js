require(["Manager", "renderer", "MusicPlayer"], function(Manager, Renderer, MusicPlayer){

    var loader = initLoader();

    Manager.waitForLoadToComplete(function(){
        loader.fadeOut(1000);
        Renderer.init();
        Renderer.setTimeSource(MusicPlayer);
        MusicPlayer.start();
        Renderer.start();
    });

    function initLoader() {
        (function ($) {
            $.fn.extend({
                center: function () {
                    return this.each(function () {
                        var top = ($(window).height() - $(this).outerHeight()) / 2;
                        var left = ($(window).width() - $(this).outerWidth()) / 2;
                        $(this).css({position: 'absolute', margin: 0, top: (top > 0 ? top : 0) + 'px', left: (left > 0 ? left : 0) + 'px'});
                    });
                }
            });
        })(jQuery);
        var loader = $('<img src="images/loading.png">')
            .css("display", "none")
        $("body").append(loader);
        loader.load(function () {
            loader.center();
            loader.fadeIn(1000);
        });
        return loader;
    }
});