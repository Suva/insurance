define(function(){
   return {
       uniforms: {
           "tDiffuse": { type: "t", value: null },
           brightness: {type: "f", value: 0}
       },
       fragmentShader:[
            "precision highp float;",
            "varying vec2 vUv;",
            "uniform sampler2D tDiffuse;",
            "uniform float brightness;",
            "void main(void)",
            "{",
                "vec3 color = texture2D(tDiffuse,vUv).xyz;",
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