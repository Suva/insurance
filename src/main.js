require(["Manager", "renderer"], function(Manager, Renderer){

    (function($){
        $.fn.extend({
            center: function () {
                return this.each(function() {
                    var top = ($(window).height() - $(this).outerHeight()) / 2;
                    var left = ($(window).width() - $(this).outerWidth()) / 2;
                    $(this).css({position:'absolute', margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
                });
            }
        });
    })(jQuery);

    var loader = $('<img src="images/loading.png">')
        .css("display", "none")
    $("body").append(loader);
    loader.load(function(){
        loader.center();
        loader.fadeIn(1000);
    });

    Manager.waitForLoadToComplete(function(){
        loader.fadeOut(1000);
        Renderer.init();
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