import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const sceneParameters = {}
sceneParameters.backgroundColor = '#040b11'

gui
    .addColor(sceneParameters, 'backgroundColor')
    .onChange(() => {
        scene.background.set(sceneParameters.backgroundColor)
    })

const scene = new THREE.Scene()
scene.background = new THREE.Color(sceneParameters.backgroundColor);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(2, 2)

// Material

const materialParameters = {}
materialParameters.radius = 0.3;
materialParameters.sineAmplitude = 0.3;
materialParameters.oscillationAmplitude = 0.3;
materialParameters.circleThickness = 0.02;
materialParameters.color1 = new THREE.Color("#ed17bf");
materialParameters.color2 = new THREE.Color("#15dcff");
materialParameters.isSmooth = true;

const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width, sizes.height)),
        uRadius: new THREE.Uniform(materialParameters.radius),
        uOscillationAmplitude: new THREE.Uniform(materialParameters.oscillationAmplitude),
        uSineAmplitude: new THREE.Uniform(materialParameters.sineAmplitude),
        uCircleThickness: new THREE.Uniform(materialParameters.circleThickness),
        uIsSmooth: new THREE.Uniform(materialParameters.isSmooth ? 1.0 : 0.0),        uColor1: new THREE.Uniform(materialParameters.color1),
        uColor1: new THREE.Uniform(materialParameters.color1),
        uColor2: new THREE.Uniform(materialParameters.color2),
    },
    transparent: true,
    side: THREE.DoubleSide
})

gui
    .add(material.uniforms.uSineAmplitude, 'value')
    .name("Sine Amplitude")
    .min(0)
    .max(1)
    .step(0.01);
gui
    .add(material.uniforms.uOscillationAmplitude, 'value')
    .name("Oscillation Amplitude")
    .min(0)
    .max(1)
    .step(0.01);
gui
    .add(material.uniforms.uCircleThickness, 'value')
    .name("Circle Thickness")
    .min(0)
    .max(0.5)
    .step(0.01);
gui
    .add(material.uniforms.uRadius, 'value')
    .name("Circle radius")
    .min(0)
    .max(0.5)
    .step(0.01);
gui
    .add(materialParameters, 'isSmooth')
    .name('Is Smooth')
    .onChange(() => {
        material.uniforms.uIsSmooth.value = materialParameters.isSmooth ? 1.0 : 0.0
    })
gui
    .addColor(materialParameters, 'color1')
    .name('Color 1')
    .onChange(() => {
        material.uniforms.uColor1.value.set(materialParameters.color1)
    })
gui
    .addColor(materialParameters, 'color2')
    .name('Color 2')
    .onChange(() => {
        material.uniforms.uColor2.value.set(materialParameters.color2)
    })

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // update uniforms
    material.uniforms.uResolution.value.set(sizes.width, sizes.height);

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    // Update controls
    // controls.update()

    const elapsedTime = clock.getElapsedTime();

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()