import {
    Renderer,
    Program,
    Mesh,
    Geometry,
    Texture,
    Vec4,
    Vec2,
    Flowmap
} from "https://unpkg.com/ogl";

import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm";

import { loadShader, clamp, mix } from "./utils.js";

export class FlowmapDeformation {
    constructor(options = {}) {
        this.container = options.container ?? document.body;
        this.imageSrc = options.imageSrc;
        this.imageSize = options.imageSize;
        this.vertexShaderPath = options.vertexShader;
        this.fragmentShaderPath = options.fragmentShader;
        this.useGui = options.useGui ?? true;
        
        this.settings = {
            distortionStrength: 0.15,
            rgbShift: 0.005,
            flowLight: 0.05,
            debugFlow: false,

            baseFalloff: 0.05,
            fastFalloff: 0.6,

            baseAlpha: 0.2,
            fastAlpha: 0.75,

            baseDissipation: 0.99,
            fastDissipation: 0.99,

            speedInfluence: 6,
            flowSmoothness: 0.08,

            ...options.settings
        };

        this.dynamicFlow = {
            falloff: this.settings.baseFalloff,
            alpha: this.settings.baseAlpha,
            dissipation: this.settings.baseDissipation
        };

        this.aspect = 1;

        this.mouse = new Vec2(-1);
        this.velocity = new Vec2();
        this.lastMouse = new Vec2();
        this.lastTime = null;

        this.update = this.update.bind(this);
        this.resize = this.resize.bind(this);
        this.updateMouse = this.updateMouse.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    async init() {
        await this.loadShaders();

        this.createRenderer();
        this.createFlowmap();
        this.createTexture();
        this.loadImage();
        this.createGeometry();
        this.createProgram();
        this.createMesh();

        if (this.useGui) {
            this.createGui();
        }

        this.addEventListeners();
        this.resize();
    }

    async loadShaders() {
        this.vertex = await loadShader(this.vertexShaderPath);
        this.fragment = await loadShader(this.fragmentShaderPath);
    }

    createRenderer() {
        this.renderer = new Renderer({
            dpr: 2
        });

        this.gl = this.renderer.gl;
        this.container.appendChild(this.gl.canvas);
    }

    createFlowmap() {
        this.flowmap = new Flowmap(this.gl, {
            falloff: this.dynamicFlow.falloff,
            dissipation: this.dynamicFlow.dissipation,
            alpha: this.dynamicFlow.alpha
        });
    }

    createTexture() {
        const gl = this.gl;

        this.texture = new Texture(gl, {
            minFilter: gl.LINEAR,
            magFilter: gl.LINEAR
        });
    }

    loadImage() {
        const img = new Image();

        img.onload = () => {
            this.texture.image = img;
        };

        img.src = this.imageSrc;
    }

    createGeometry() {
        this.geometry = new Geometry(this.gl, {
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
    }

    createProgram() {
        const cover = this.getCoverScale();

        this.program = new Program(this.gl, {
            vertex: this.vertex,
            fragment: this.fragment,
            uniforms: {
                tWater: { value: this.texture },
                tFlow: this.flowmap.uniform,

                res: {
                    value: new Vec4(
                        window.innerWidth,
                        window.innerHeight,
                        cover.a1,
                        cover.a2
                    )
                },

                uDistortionStrength: {
                    value: this.settings.distortionStrength
                },

                uRGBShift: {
                    value: this.settings.rgbShift
                },

                uFlowLight: {
                    value: this.settings.flowLight
                },

                uDebugFlow: {
                    value: this.settings.debugFlow ? 1 : 0
                }
            }
        });
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });
    }

    createGui() {
        this.gui = new GUI();

        this.gui
            .add(this.settings, "distortionStrength", 0, 0.5, 0.001)
            .onChange((value) => {
                this.program.uniforms.uDistortionStrength.value = value;
            });

        this.gui
            .add(this.settings, "rgbShift", 0, 0.05, 0.001)
            .onChange((value) => {
                this.program.uniforms.uRGBShift.value = value;
            });

        this.gui
            .add(this.settings, "flowLight", 0, 0.3, 0.001)
            .onChange((value) => {
                this.program.uniforms.uFlowLight.value = value;
            });

        this.gui
            .add(this.settings, "debugFlow")
            .onChange((value) => {
                this.program.uniforms.uDebugFlow.value = value ? 1 : 0;
            });

        const flowFolder = this.gui.addFolder("Flowmap");

        flowFolder.add(this.settings, "baseFalloff", 0.0, 1.0, 0.001);
        flowFolder.add(this.settings, "fastFalloff", 0.05, 0.8, 0.001);

        flowFolder.add(this.settings, "baseAlpha", 0.05, 1.0, 0.001);
        flowFolder.add(this.settings, "fastAlpha", 0.05, 1.5, 0.001);

        flowFolder.add(this.settings, "baseDissipation", 0.7, 0.99, 0.001);
        flowFolder.add(this.settings, "fastDissipation", 0.7, 0.99, 0.001);

        flowFolder.add(this.settings, "speedInfluence", 0.1, 10.0, 0.01);
        flowFolder.add(this.settings, "flowSmoothness", 0.01, 0.3, 0.001);
    }

    getCoverScale() {
        let a1;
        let a2;

        const imageAspect = this.imageSize[1] / this.imageSize[0];

        if (window.innerHeight / window.innerWidth < imageAspect) {
            a1 = 1;
            a2 = window.innerHeight / window.innerWidth / imageAspect;
        } else {
            a1 = (window.innerWidth / window.innerHeight) * imageAspect;
            a2 = 1;
        }

        return { a1, a2 };
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.aspect = window.innerWidth / window.innerHeight;

        const cover = this.getCoverScale();

        this.program.uniforms.res.value = new Vec4(
            window.innerWidth,
            window.innerHeight,
            cover.a1,
            cover.a2
        );
    }

    updateMouse(e) {
        if (e.changedTouches && e.changedTouches.length) {
            e.x = e.changedTouches[0].pageX;
            e.y = e.changedTouches[0].pageY;
        }

        if (e.x === undefined) {
            e.x = e.pageX;
            e.y = e.pageY;
        }

        this.mouse.set(
            e.x / this.gl.renderer.width,
            1.0 - e.y / this.gl.renderer.height
        );

        if (!this.lastTime) {
            this.lastTime = performance.now();
            this.lastMouse.set(e.x, e.y);
        }

        const deltaX = e.x - this.lastMouse.x;
        const deltaY = e.y - this.lastMouse.y;

        this.lastMouse.set(e.x, e.y);

        const time = performance.now();
        const delta = Math.max(10.4, time - this.lastTime);

        this.lastTime = time;

        this.velocity.x = deltaX / delta;
        this.velocity.y = deltaY / delta;

        this.velocity.needsUpdate = true;
    }

    updateDynamicFlow() {
        const speed = this.velocity.len();
        const speedNormalized = clamp(
            speed * this.settings.speedInfluence,
            0,
            1
        );

        const targetFalloff = mix(
            this.settings.baseFalloff,
            this.settings.fastFalloff,
            speedNormalized
        );

        const targetAlpha = mix(
            this.settings.baseAlpha,
            this.settings.fastAlpha,
            speedNormalized
        );

        const targetDissipation = mix(
            this.settings.baseDissipation,
            this.settings.fastDissipation,
            speedNormalized
        );

        this.dynamicFlow.falloff = mix(
            this.dynamicFlow.falloff,
            targetFalloff,
            this.settings.flowSmoothness
        );

        this.dynamicFlow.alpha = mix(
            this.dynamicFlow.alpha,
            targetAlpha,
            this.settings.flowSmoothness
        );

        this.dynamicFlow.dissipation = mix(
            this.dynamicFlow.dissipation,
            targetDissipation,
            this.settings.flowSmoothness
        );

        this.flowmap.mesh.program.uniforms.uFalloff.value =
            this.dynamicFlow.falloff * 0.5;

        this.flowmap.mesh.program.uniforms.uAlpha.value =
            this.dynamicFlow.alpha;

        this.flowmap.mesh.program.uniforms.uDissipation.value =
            this.dynamicFlow.dissipation;
    }

    updateFlowmap() {
        if (!this.velocity.needsUpdate) {
            this.mouse.set(-1);
            this.velocity.set(0);
        }

        this.velocity.needsUpdate = false;

        this.updateDynamicFlow();

        this.flowmap.aspect = this.aspect;
        this.flowmap.mouse.copy(this.mouse);

        this.flowmap.velocity.lerp(
            this.velocity,
            this.velocity.len() ? 0.15 : 0.1
        );

        this.flowmap.update();
    }

    update() {
        requestAnimationFrame(this.update);

        this.updateFlowmap();

        this.renderer.render({
            scene: this.mesh
        });
    }

    start() {
        this.update();
    }

    addEventListeners() {
        window.addEventListener("resize", this.resize);
        window.addEventListener("mousemove", this.updateMouse);
        window.addEventListener("keydown", this.onKeyDown);
    }

    onKeyDown(e) {
        if (e.key === "d") {
            this.settings.debugFlow = !this.settings.debugFlow;

            this.program.uniforms.uDebugFlow.value =
                this.settings.debugFlow ? 1 : 0;

            if (this.gui) {
                this.gui.controllersRecursive().forEach((controller) => {
                    controller.updateDisplay();
                });
            }
        }
    }
}