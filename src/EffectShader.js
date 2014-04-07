define(function(){
   return {
       uniforms: {
           "tDiffuse": { type: "t", value: null },
           brightness: {type: "f", value: 0},
           aberration: {type: "f", value: 0}
       },
       fragmentShader:[
            "precision highp float;",
            "varying vec2 vUv;",
            "uniform sampler2D tDiffuse;",
            "uniform float brightness;",
            "uniform float aberration;",
            "void main(void)",
            "{",
                "vec3 color = texture2D(tDiffuse,vUv).rgb;",
                "if(aberration > 0.0){",
                "   color.r = texture2D(tDiffuse,vUv + vec2(aberration, 0)).r;",
                "   color.g = texture2D(tDiffuse,vUv + vec2(-aberration, 0)).g;",
                "}",
                "gl_FragColor = vec4(color+brightness,1.0);",
            "}"
       ].join("\n"),
       vertexShader:[

           "varying vec2 vUv;",

           "void main() {",

           "vUv = uv;",
           "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

           "}"
       ].join("\n")
   }
});