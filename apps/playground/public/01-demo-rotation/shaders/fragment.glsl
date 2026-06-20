precision highp float;

uniform vec2 uResolution;
uniform float uTime;

mat2 rot(float a) {
  return mat2(
    cos(a), -sin(a),
    sin(a),  cos(a)
  );
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / uResolution.xy;

  vec2 centeredUv = screenUv - 0.5;
  centeredUv.x *= uResolution.x / uResolution.y;

  float distanceFromCenter = length(centeredUv);

  float centerInfluence = 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);

  float wave = sin(uTime * 2.0 + centerInfluence);

  float twistStrength = 5.0;
  float baseRotation = 20.0;

  float twistAngle = wave * twistStrength;

  vec2 twistedUv = rot(baseRotation + twistAngle) * centeredUv;

  float blackWhiteSplit = step(0.0, twistedUv.y);

  gl_FragColor = vec4(vec3(blackWhiteSplit), 1.0);
}