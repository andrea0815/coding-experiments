varying vec2 vUv;

uniform float uTime;
uniform float uSineAmplitude;
uniform float uOscillationAmplitude;
uniform float uCircleThickness;
uniform float uRadius;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uResolution;

#define PI 3.1415926535897932384626433832795

void main() {

    // Correct Aspect ratio
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;

    // Pattern 27 – funny circle blobs with sinus
    float maxVal = 1.0;
    float minVal = maxVal - uOscillationAmplitude;

    float sinoids = sin(uTime * 0.5) * sin(uTime * 20.0 + 2.0) * sin(uTime * 3.0);
    float remappedOscillation = minVal + (sinoids * 0.5 + 0.5) * (maxVal - minVal);

    vec2 wavedUv = vec2(uv.x + sin(uv.y * 70.0 + uTime) * remappedOscillation * uSineAmplitude, uv.y + sin(uv.x * 70.0 + uTime) * remappedOscillation * uSineAmplitude);
    float strength = 1.0 - step(uCircleThickness, abs(distance(wavedUv, vec2(0.0)) - uRadius));


    // Clamp the strength
    strength = clamp(strength, 0.0, 1.0);

    float distanceToCenter = distance(uv, vec2(0.0)) * 2.0;
    vec4 mixedColor = vec4(mix(uColor1, uColor2, distanceToCenter), strength);

    gl_FragColor = vec4(mixedColor);
}