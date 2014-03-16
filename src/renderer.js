define(function(){
    var renderer = new THREE.WebGLRenderer( { antialias: false, clearAlpha: 1 } );

    var scene;
    var timeSource;

    return {
        init:function(){
            renderer.autoClear = false;
            $(window).resize(resizeViewPort);
            document.body.appendChild( renderer.domElement );
            resizeViewPort();
        },
        setTimeSource: function(argTimeSource){
            timeSource = argTimeSource;
        },
        setScene: function setScene(argScene){
            scene = argScene;
        },
        start: function() {
            function render() {
                if(!scene){
                    requestAnimationFrame(render);
                    return;
                }
                scene.render(timeSource.getTime());
                requestAnimationFrame(render);
                renderer.render(scene.scene, scene.camera);
            }
            render();
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