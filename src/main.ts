import { GUI } from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import waterFragmentShader from "./shaders/water/fragment.glsl";
import waterVertexShader from "./shaders/water/vertex.glsl";
import "./style.css";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const colorsFolder = gui.addFolder("Color").close();
const BigWavesFolder = gui.addFolder("Wave").close();
const SmallWavesFolder = gui.addFolder("Small Waves").close();
const colors = {
  depthColor: "#61a6d1",
  surfaceColor: "#9bd8ff",
};

// Canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();
//sky background color
scene.background = new THREE.Color("#708090");

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(10, 10, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(0.35, 0.3) },
    uBigWaveSpeed: { value: 0.4 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.35 },
    uSmallWavesIterations: { value: 4 },

    uDepthColor: { value: new THREE.Color(colors.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colors.surfaceColor) },
    uColorOffset: { value: 0.3 },
    uColorMultiplier: { value: 2.4 },
  },
});
waterMaterial.side = THREE.DoubleSide;

BigWavesFolder.add(waterMaterial.uniforms.uBigWavesElevation, "value").min(0).max(1).step(0.001).name("Elevation");
BigWavesFolder.add(waterMaterial.uniforms.uBigWavesFrequency.value, "x").min(0).max(10).step(0.001).name("Frequency X");
BigWavesFolder.add(waterMaterial.uniforms.uBigWavesFrequency.value, "y").min(0).max(10).step(0.001).name("Frequency Y");
BigWavesFolder.add(waterMaterial.uniforms.uBigWaveSpeed, "value").min(0).max(4).step(0.001).name("Speed");

SmallWavesFolder.add(waterMaterial.uniforms.uSmallWavesElevation, "value").min(0).max(1).step(0.001).name("Elevation");
SmallWavesFolder.add(waterMaterial.uniforms.uSmallWavesFrequency, "value").min(0).max(30).step(0.001).name("Frequency");
SmallWavesFolder.add(waterMaterial.uniforms.uSmallWavesSpeed, "value").min(0).max(4).step(0.001).name("Speed");
SmallWavesFolder.add(waterMaterial.uniforms.uSmallWavesIterations, "value").min(0).max(5).step(1).name("Iterations");

colorsFolder
  .addColor(colors, "depthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(colors.depthColor);
  })
  .name("Depth Color");
colorsFolder
  .addColor(colors, "surfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(colors.surfaceColor);
  })
  .name("Surface Color");
colorsFolder.add(waterMaterial.uniforms.uColorOffset, "value").min(0).max(1).step(0.001).name("Color Offset");
colorsFolder.add(waterMaterial.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.001).name("Color Multiplier");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
