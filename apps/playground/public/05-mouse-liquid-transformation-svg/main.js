import { FlowmapDeformation } from "./js/FlowmapDeformation.js";

const effect = new FlowmapDeformation({
  container: document.body,
  imageSrc: "./img/demo-1.jpg",
  imageSize: [2400, 3595],
  vertexShader: "./shaders/vertex.glsl",
  fragmentShader: "./shaders/fragment.glsl",
  useGui: false,

  alphaMode: "opaque",
  transparent: false,
  premultiplyAlpha: false,

  settings: {
    distortionStrength: 0.005,
    rgbShift: 0.005,
    flowLight: 0.05,
    debugFlow: false,

    baseFalloff: 0.99,
    fastFalloff: 0.99,

    baseAlpha: 0.2,
    fastAlpha: 0.3,

    baseDissipation: 0.95,
    fastDissipation: 0.95,

    speedInfluence: 6,
    flowSmoothness: 0.08
  }
});

await effect.init();
effect.start();


const svgEffect = new FlowmapDeformation({
  imageSrc: "./img/flowing.svg",
  imageSize: [1000, 1000],
  vertexShader: "./shaders/vertex.glsl",
  fragmentShader: "./shaders/fragment.glsl",

  useGui: false,

  dpr: 2,
  transparent: true,
  premultiplyAlpha: true,
  alphaMode: "mask",
  canvasClass: "demo3",
  fit: "contain",

  settings: {
    distortionStrength: 0.2,
    rgbShift: 0.005,
    flowLight: 0.0,
    debugFlow: false,

    baseFalloff: 0.2,
    fastFalloff: 0.3,

    baseAlpha: 1.0,
    fastAlpha: 0.5,

    baseDissipation: 0.99,
    fastDissipation: 0.99,

    speedInfluence: 7,
    flowSmoothness: 0.08,

    uNoiseStrength: 0.02,
    uNoiseSpeed: 0.5,
  }
});

await svgEffect.init();
svgEffect.start();