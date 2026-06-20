precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;

mat2 rot(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / uResolution.xy;

  vec2 pointerUv = uPointer;
  pointerUv.x *= uResolution.x / uResolution.y;

  vec2 centeredUv = screenUv - 0.5;
  centeredUv.x *= uResolution.x / uResolution.y;

  float distanceFromCenter = length(centeredUv);

  float centerInfluence = 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);

  float wave = sin(uTime + centerInfluence) * sin(centerInfluence * (pointerUv.x) * 10.0);

  float twistStrength = 10.0;
  float baseRotation = 0.0;

  float twistAngle = wave * twistStrength * (pointerUv.y);

  vec2 twistedUv = rot(baseRotation + twistAngle) * centeredUv;

  //Line
  float lineWidth = 0.1 * pointerUv.x + 0.01;

  float Line = step(-lineWidth, twistedUv.y);
  Line -= step(lineWidth, twistedUv.y);

  gl_FragColor = vec4(vec3(Line, pointerUv.x, pointerUv.y), 1.0);
}