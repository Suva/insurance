define(function(){
    var fragShader = [
        'precision mediump float;',
        '#define PI 3.1415926535897932384626433832795',
        'uniform float _time;',
        'uniform vec2 u_k;',
        'varying vec2 v_coords;',
        'varying vec3 n;',
        'void main() {',
            'float u_time = _time / 2.0;',
            'float v = 0.0;',
            'vec2 c = v_coords * u_k - u_k/2.0;',
            'v += sin((c.x+u_time));',
            'v += sin((c.y+u_time)/2.0);',
            'v += sin((c.x+c.y+u_time)/2.0);',
            'c += u_k/2.0 * vec2(sin(u_time/3.0), cos(u_time/2.0));',
            'v += sin(sqrt(c.x*c.x+c.y*c.y+1.0)+u_time);',
            'v = v/2.0;',
            'float intensity = cos(PI*v) * 0.8 + 0.5;',
            'vec3 col;',
            'col.b = intensity * 1.0;',
            'col.g = min(1.0, col.g + max(0.0, intensity - 0.5) * 1.5);',
            'col.r = min(1.0, col.r + max(0.0, intensity - 0.5) * 1.5);',
            'gl_FragColor = vec4(col.r, col.g, col.b, 1);',
        '}'
    ].join("\n");

    var vertShader = [
        'precision mediump float;',
        'attribute vec3 vertex;',
        'attribute vec4 tangent;',
        'uniform float _time; // time in seconds',
        'varying vec2 v_coords;',
        'varying vec3 n;',
        'void main(void) {',
            '// compute position',
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            'v_coords = uv;',
            '// compute light info',
            'n = normalize(normalMatrix * normal);',
        '}'
    ].join("\n");

    var uniforms = {
        "_time": { type: "f", value: 0 },
        "u_k": { type: "v2", value: new THREE.Vector2(Math.PI * 80, Math.PI * 80) }
    };

    return {
        uniforms: uniforms,
        fragmentShader: fragShader,
        vertexShader: vertShader
    }

});