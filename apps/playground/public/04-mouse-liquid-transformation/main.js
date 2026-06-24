import { FlowmapDeformation } from "./js/FlowmapDeformation.js";

const effect = new FlowmapDeformation({
  container: document.body,
  imageSrc: "./img/demo-1.jpg",
  imageSize: [4000, 6000],
  vertexShader: "./shaders/vertex.glsl",
  fragmentShader: "./shaders/fragment.glsl",
  useGui: true
});

await effect.init();
effect.start();