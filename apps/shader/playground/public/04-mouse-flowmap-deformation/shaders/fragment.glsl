precision highp float;

uniform sampler2D tWater;
uniform vec4 res;

varying vec2 vUv;

void main() {
  vec2 uv = 0.5 * gl_FragCoord.xy / res.xy;

  vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);

  vec3 color = texture2D(tWater, myUV).rgb;

  gl_FragColor = vec4(color, 1.0);
}