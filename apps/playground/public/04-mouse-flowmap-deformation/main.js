import {
  Renderer,
  Program,
  Mesh,
  Geometry,
  Texture,
  Vec4
} from "https://unpkg.com/ogl";

// LOAD SHADER

async function loadShader(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load shader: ${path}`);
  }

  return await response.text();
}

const vertex = await loadShader("./shaders/vertex.glsl");
const fragment = await loadShader("./shaders/fragment.glsl");


// SCENE SETUP 

const renderer = new Renderer({
  dpr: 2
});

const gl = renderer.gl;
document.body.appendChild(gl.canvas);



// Texture

const texture = new Texture(gl, {
  minFilter: gl.LINEAR,
  magFilter: gl.LINEAR
});

// Image

const img = new Image();
const imgSize = [4000, 6000];

img.onload = () => {
  texture.image = img;
};

img.src = "./img/demo1.jpg";

function getCoverScale() {
  let a1;
  let a2;

  const imageAspect = imgSize[1] / imgSize[0];

  if (window.innerHeight / window.innerWidth < imageAspect) {
    a1 = 1;
    a2 = window.innerHeight / window.innerWidth / imageAspect;
  } else {
    a1 = (window.innerWidth / window.innerHeight) * imageAspect;
    a2 = 1;
  }

  return { a1, a2 };
}

const cover = getCoverScale();

// Object
const geometry = new Geometry(gl, {
  position: {
    size: 2,
    data: new Float32Array([
      -1, -1,
      3, -1,
      -1, 3
    ])
  },
  uv: {
    size: 2,
    data: new Float32Array([
      0, 0,
      2, 0,
      0, 2
    ])
  }
});

const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    tWater: { value: texture },
    res: {
      value: new Vec4(
        window.innerWidth,
        window.innerHeight,
        cover.a1,
        cover.a2
      )
    }
  }
});

const mesh = new Mesh(gl, {
  geometry,
  program
});

// Resize

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  const cover = getCoverScale();

  program.uniforms.res.value = new Vec4(
    window.innerWidth,
    window.innerHeight,
    cover.a1,
    cover.a2
  );
}

window.addEventListener("resize", resize);
resize();

// RENDER

function update() {
  requestAnimationFrame(update);
  renderer.render({ scene: mesh });
}

update();