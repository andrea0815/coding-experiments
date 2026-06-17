uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uBigNoiseWavesElevation;
uniform vec2 uBigNoiseWavesFrequency;
uniform float uBigNoiseWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIteration;

uniform float uFogMaxDistance;

varying float vElevation;
varying float vBigWaveElevation;
varying vec3 vWorldPosition;
varying float vFog;

#include ../includes/perlin3d.glsl

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;
    float elevation = cnoise(vec3(modelPosition.xz * uBigNoiseWavesFrequency, uTime * uBigNoiseWavesSpeed)) * uBigNoiseWavesElevation;
    float bigWaveElevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;
    elevation += bigWaveElevation;

    for(float i = 1.0; i <= uSmallWavesIteration; i++) {
        elevation += -abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    modelPosition.y += elevation;

    vec4 viewMatrix = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewMatrix;

    gl_Position = projectedPosition;

    // Fog
    float fog = 1.0 - clamp(length(cameraPosition - modelPosition.xyz) / uFogMaxDistance, 0.0, 1.0);
    fog = smoothstep(0.1, 0.5, fog);

    // varyings
    vElevation = elevation;
    vBigWaveElevation = bigWaveElevation;
    vWorldPosition = modelPosition.xyz;
    vFog = fog;
}
