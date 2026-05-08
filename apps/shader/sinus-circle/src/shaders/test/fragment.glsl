varying vec2 vUv;

uniform float uTime;
uniform float uSineAmplitude;
uniform float uOscillationAmplitude;
uniform float uCircleThickness;
uniform float uRadius;
uniform float uIsSmooth;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uResolution;

#define PI 3.1415926535897932384626433832795

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {

    // Correct Aspect ratio
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;

    // Pattern 3
    // float strength = uv.x;

    // Pattern 4
    // float strength = uv.y;

    // Pattern 5 – 
    // float strength = 1.0 - uv.y;

    // Pattern 6
    // float strength =  uv.y * 10.0;

    // Pattern 7
    // float strength = mod(uv.y * 10.0, 1.0);

    // Pattern 8
    // float strength = mod(uv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // Pattern 9
    // float strength = mod(uv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // Pattern 10
    // float strength = step(0.2, mod(uv.x * 10.0, 1.0));
    // strength *= step(0.9, mod(uv.y * 10.0, 1.0));

    // Pattern 11
    // float barX = step(0.4, mod(uv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(uv.y * 10.0, 1.0));

    // float barY = step(0.2, mod(uv.y * 10.0, 1.0));
    // barY *= step(0.6, mod(uv.x * 10.0, 1.0));

    // float strength = barX + barY;

     // Pattern 12
    // float barX = step(0.1, mod(uv.x * 10.0 , 1.0));
    // barX *= step(0.8, mod(uv.y * 10.0 + 0.3, 1.0));

    // float barY = step(0.1, mod(uv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(uv.x * 10.0 + 0.3, 1.0));

    // float strength = barX + barY;

    // Pattern 13
    // float strength = abs(uv.x - 0.5);

    // Pattern 14
    // float strength = min(abs(uv.x - 0.5), abs(uv.y - 0.5));

     // Pattern 15
    // float strength = max(abs(uv.x - 0.5), abs(uv.y - 0.5));

    // Pattern 16
    // float strength = max(step(0.2, abs(uv.x - 0.5)), step(0.2, abs(uv.y - 0.5)));

    // Pattern 17
    // float strength = step(0.2, max(abs(uv.x - 0.5), abs(uv.y - 0.5)));
    // strength *= 1.0 - step(0.3, max(abs(uv.x - 0.5), abs(uv.y - 0.5)));

    // Pattern 17 
    // float strength = floor(uv.x * 11.0 + 1.0) / 11.0;

    // Pattern 18
    // float strength = floor(uv.x * 20.0) / 20.0;
    // strength *= floor((uv.y) * 20.0) / 20.0;

    // Pattern 19
    // float strength = random(uv);

    // Pattern 20
    // vec2 gridUv = vec2(
    //     floor(uv.x * 20.0 + uv.y * 10.0) / 20.0,
    //     floor(uv.y * 20.0 + uv.x * 10.0) / 20.0
    // );
    // float strength = random(gridUv );

     // Pattern 20
    // float strength = distance(uv, vec2(0.5, 0.5));

      // Pattern 21 – light spark
    // float strength = 0.015 / distance(uv, vec2(0.5)) + 0.1;

    // Pattern 22 
    // float xScale = 0.2;
    // float pointCenter = 0.5;

    // vec2 lightUv = vec2(
    //     uv.x * xScale + (1.0 - xScale) * pointCenter,
    //     uv.y
    // );

    // float strength = 0.015 / distance(lightUv, vec2(pointCenter));

    // Pattern 23
    // float xScale = 0.2;
    // float pointCenter = 0.5;

    // vec2 lightUvX = vec2(uv.x * xScale + (1.0 - xScale) * pointCenter, uv.y);
    // float lightX = 0.015 / distance(lightUvX, vec2(pointCenter));

    // vec2 lightUvY = vec2(uv.x , uv.y * xScale + (1.0 - xScale) * pointCenter);
    // float lightY = 0.015 / distance(lightUvY, vec2(pointCenter));

    // float strength = lightX * lightY;

    // Pattern 24 – rotated spark
    // vec2 rotatedUv = rotate(uv, PI * 0.25, vec2(0.5));

    // float xScale = 0.2;
    // float pointCenter = 0.5;

    // vec2 lightUvX = vec2(rotatedUv.x * xScale + (1.0 - xScale) * pointCenter, rotatedUv.y);
    // float lightX = 0.015 / distance(lightUvX, vec2(pointCenter));

    // vec2 lightUvY = vec2(rotatedUv.x , rotatedUv.y * xScale + (1.0 - xScale) * pointCenter);
    // float lightY = 0.015 / distance(lightUvY, vec2(pointCenter));

    // float strength = lightX * lightY;

    // Pattern 25
    // float strength = step(0.3, distance(uv, vec2(0.0)));

    // Pattern 26 – soft circle
    // float strength =  abs(distance(uv, vec2(0.0)) - 0.1);

    // Pattern 27 – hard circle
    // float strength = step(0.1, abs(distance(uv, vec2(0.0)) - 0.3));

    // Pattern 27 – funny circle blobs with sinus
    float maxVal = 1.0;
    float minVal = maxVal - uOscillationAmplitude;

    float radius = 0.3;

    float sinoids = sin(uTime * 0.5) * sin(uTime * 20.0 + 2.0) * sin(uTime * 3.0);
    float remappedOscillation = minVal + (sinoids * 0.5 + 0.5) * (maxVal - minVal);

    vec2 wavedUv = vec2(uv.x + sin(uv.y * 70.0 + uTime) * remappedOscillation * uSineAmplitude, uv.y + sin(uv.x * 70.0 + uTime) * remappedOscillation * uSineAmplitude);
    float strength = 1.0 - step(uCircleThickness, abs(distance(wavedUv, vec2(0.0)) - uRadius));

    // Pattern 28 – circle gradient with pi
    // float angle = atan(uv.x - 0.5, uv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // Pattern 29 – circle gradient stripes
    // float angle = atan(uv.x - 0.5, uv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // angle = mod(angle, 1.0);
    // float strength = angle;

    // Pattern 30 – circle gradient stripes
    // float stripes = 50.0;

    // float angle = atan(uv.x - 0.5, uv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.9;
    // float strength = sin(angle * PI * 2.0 * stripes);

    // Pattern 31 – flower or wavy sinus circle
    // float leaves = 20.0;

    // float angle = atan(uv.x - 0.5, uv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * PI * 2.0 * leaves);

    // float radius = 0.3 + sinusoid * 0.1;
    // float strength = 1.0 - step(0.01, abs(distance(uv, vec2(0.5)) - radius));

    // Pattern 32 – perlin noise
    // float strength = cnoise(uv * 20.0);

    // Pattern 33 – hard perlin noise 
    // float strength = step(0.0, cnoise(uv * 20.0));

    // Pattern 34 – perlin noise lines
    // float strength = abs(cnoise(uv * 20.0));

    // Pattern 35 – perlin noise lines
    // float strength = step(0.9, sin(cnoise(uv * 10.0) * 20.0));

    // Pattern 36 – mix with color
    // float strength = sin(cnoise(uv * 1.0) * 200.0);

    // Clamp the strength
    strength = clamp(strength, 0.0, 1.0);

    float distanceToCenter = distance(uv, vec2(0.0)) * 2.0;
    vec4 mixedColor = vec4(mix(uColor1, uColor2, distanceToCenter), strength);

    gl_FragColor = vec4(mixedColor);
}