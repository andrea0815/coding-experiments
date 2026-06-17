uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
uniform float uTime;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

#define PI 3.1415926535897932384626433832795

void main() {

    // Displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.101, displacementIntensity);

    // radial angle
    vec3 displacement = vec3(cos(aAngle) * 1.0, sin(aAngle) * 1.0, 0.5);
    displacement *= normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 1.0;
    displacement *= aIntensity;

    newPosition += displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // picture
    float colorIntensity = displacementIntensity * aIntensity + 1.0;
    float pictureIntensityR = texture2D(uPictureTexture, uv).r * colorIntensity;
    float pictureIntensityG = texture2D(uPictureTexture, uv).g * colorIntensity;
    float pictureIntensityB = texture2D(uPictureTexture, uv).b * colorIntensity;

    // Point size intensity
    float pointSizeIntensity = 1.0 + sin(uTime * 4.0 + aIntensity * PI * 2.0) * aIntensity * 0.3;
    gl_PointSize = 0.21 * (1.0 - displacementIntensity * 0.7) * pictureIntensityG * uResolution.y * pointSizeIntensity;
    gl_PointSize *= (1.0 / -viewPosition.z);

    // varyings
    float colorR = pow(pictureIntensityR, 2.0);
    float colorG = pow(pictureIntensityG, 2.0);
    float colorB = pow(pictureIntensityB, 2.0);
    vColor = vec3(1.0 * colorR, 0.5 * colorG, 0.3 * colorB);
}