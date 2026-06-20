    // Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float lineMask(float thickness, float center, float coordinate) {
    float leftEdge = step(center - thickness / 2.0, coordinate);
    float rightEdge = 1.0 - step(center + thickness / 2.0, coordinate);

    return leftEdge * rightEdge;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pattern = vec3(0.0); // background color

    float repeatCount = 10.0;
    vec2 repeatedUV = fract(uv * repeatCount);

    float verticalMask = lineMask(0.1, 0.5, repeatedUV.x);
    pattern = mix(pattern, vec3(0.3, 1.0, 0.7), verticalMask);

    float horizontalMask = lineMask(0.1, 0.5, uv.y);
    pattern = mix(pattern, vec3(0.6, 0.0, 0.7), horizontalMask);

    float horizontalMask2 = lineMask(0.3, 0.3, repeatedUV.y);
    pattern = mix(pattern, vec3(1.0, 1.0, 0.8), horizontalMask2);

// draw first line

// draw second line on top

// draw third line on top of both

    color = pattern;

    gl_FragColor = vec4(color, 1.0);
}