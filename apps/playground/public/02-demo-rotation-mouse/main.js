async function loadText(path) {
  return (await fetch(path)).text();
}

const [vertex, fragment] = await Promise.all([
  loadText("./shaders/vertex.glsl"),
  loadText("./shaders/fragment.glsl"),
]);

const canvas = document.querySelector("#gl");
const gl = canvas.getContext("webgl");

function shader(type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s));
  }
  return s;
}

const program = gl.createProgram();
gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
gl.linkProgram(program);
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, 3, -1, -1, 3]),
  gl.STATIC_DRAW
);

const position = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

const uResolution = gl.getUniformLocation(program, "uResolution");
const uTime = gl.getUniformLocation(program, "uTime");
const uPointer = gl.getUniformLocation(program, "uPointer");

// Pointer
const pointer = {
  x: 0.5,
  y: 0.5,
};

function updatePointer(clientX, clientY) {
  pointer.x = clientX / innerWidth;
  pointer.y = 1.0 - clientY / innerHeight;
}

addEventListener("mousemove", (e) => {
  updatePointer(e.clientX, e.clientY);
});

addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  updatePointer(touch.clientX, touch.clientY);
});

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

addEventListener("resize", resize);
resize();

function render(t) {
  gl.uniform2f(uResolution, canvas.width, canvas.height);
  gl.uniform1f(uTime, t * 0.001);
  gl.uniform2f(uPointer, pointer.x, pointer.y);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);