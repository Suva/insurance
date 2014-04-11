define(function(require){
    var EffectShader = require("EffectShader");
    var TimeLine = null;

    var renderer = new THREE.WebGLRenderer( {antialias: false, alpha:true} );
    renderer.shadowMapEnabled = true;

    var renderModel = new THREE.RenderPass();

    var composer = InitializeComposer();

    var scene;
    var timeSource;

    return {
        init:function(){
            renderer.autoClear = false;
            $(window).resize(resizeViewPort);
            document.body.appendChild( renderer.domElement );
            $("canvas").hide();
            resizeViewPort();
        },
        setTimeSource: function(argTimeSource){
            timeSource = argTimeSource;
        },
        setTimeLine: function(timeLine){
            TimeLine = timeLine;
        },
        start: function() {
            $("canvas").fadeIn(3000);
            var oldScene = null;
            function render() {
                var events = timeSource.getEvents();

                dispatchEvents(events, TimeLine);
                var sceneObj = TimeLine.getScene();
                var renderScene = sceneObj.renderScene;

                scene = sceneObj.sceneObject;

                if(!scene){
                    requestAnimationFrame(render);
                    return;
                }

                dispatchEvents(events, scene);
                scene.render(timeSource.getTime());

                requestAnimationFrame(render);


                renderModel.scene = renderScene;
                renderModel.camera = scene.camera;

                composer.render();
            }
            render();
        },
        renderer: renderer,
        prerender: function(){
            var renderCam = new THREE.PerspectiveCamera(80, 16 / 9, 0.1, 5000);
            renderCam.position.set(0, 0, -1000);
            renderCam.lookAt(new THREE.Vector3());

            var scene = TimeLine.getScene().renderScene;
            renderer.render(scene, renderCam);



        }
    };

    function dispatchEvents(events, target) {
        if (events) _.each(events, function (event) {
            if(target.onEvent)
                target.onEvent(event);
        });
    }

    function resizeViewPort() {
        var width = window.innerWidth;
        var height = width * (9 / 16);
        var position = (window.innerHeight - height) / 2;
        renderer.setSize(width, height);
        $("canvas").css("margin-top", position + "px");
    }

    function InitializeComposer() {
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectBloom = new THREE.BloomPass(0.8);
        var effectVignette = new THREE.ShaderPass(THREE.VignetteShader);
        effectPass = new THREE.ShaderPass(EffectShader);
        effectCopy.renderToScreen = true;

        var composer = new THREE.EffectComposer(renderer);
        composer.addPass(renderModel);
        composer.addPass(effectBloom);
        composer.addPass(effectVignette);
        composer.addPass(effectPass);
        composer.addPass(effectCopy);
        return composer;
    }
});