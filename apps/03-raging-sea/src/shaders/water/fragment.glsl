uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uFogColor;

uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uFogMaxDistance;

varying float vElevation;
varying float vFog;
varying float vBigWaveElevation;

void main() {

    // color

    float elevation = vElevation - vBigWaveElevation;

    float mixStrength = ((vElevation - vBigWaveElevation) + uColorOffset) * uColorMultiplier;

    vec3 waterColor = mix(uDepthColor, uSurfaceColor, elevation * mixStrength);
    vec3 color = mix(uFogColor, waterColor, vFog);

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}