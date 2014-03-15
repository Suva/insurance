define(function(){
    var renderer = new THREE.WebGLRenderer( { antialias: false, clearAlpha: 1 } );

    return {
        init:function(){
            renderer.autoClear = false;
            $(window).resize(resizeViewPort);
            document.body.appendChild( renderer.domElement );
            resizeViewPort();
        },
        renderer: renderer
    };

    function resizeViewPort() {
        var width = window.innerWidth;
        var height = width * (9 / 16);
        var position = (window.innerHeight - height) / 2;
        renderer.setSize(width, height);
        $("canvas").css("margin-top", position + "px");
    }
});