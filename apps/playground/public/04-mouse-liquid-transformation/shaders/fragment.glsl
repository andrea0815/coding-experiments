precision highp float;

uniform sampler2D tWater;
uniform sampler2D tFlow;
uniform vec4 res;

uniform float uDistortionStrength;
uniform float uRGBShift;
uniform float uFlowLight;
uniform float uDebugFlow;

varying vec2 vUv;

void main() {
  // Flow map texture
  vec3 flow = texture2D(tFlow, vUv).rgb;

  // corrected aspect ratio for the image
  vec2 uv = 0.5 * gl_FragCoord.xy / res.xy;
  vec2 imageUv = (uv - vec2(0.5)) * res.zw + vec2(0.5);

  // Create distortion
  imageUv -= flow.xy * uDistortionStrength;

  // distorted image
  float r = texture2D(tWater, imageUv + flow.xy * uRGBShift).r;
  float g = texture2D(tWater, imageUv).g;
  float b = texture2D(tWater, imageUv - flow.xy * uRGBShift).b;
  vec3 color = vec3(r, g, b);

  color += flow.b * uFlowLight;

  if(uDebugFlow > 0.5) {
    gl_FragColor = vec4(flow, 1.0);
  } else {
    gl_FragColor = vec4(color, 1.0);
  }
}