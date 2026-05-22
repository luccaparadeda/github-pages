import * as THREE from 'three';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060a, 0.0009);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);
camera.position.z = 800;

const PARTICLE_COUNT = 6000;
const positions = new Float32Array(PARTICLE_COUNT * 3);
const colors = new Float32Array(PARTICLE_COUNT * 3);
const palette = [
    new THREE.Color('#7df9ff'),
    new THREE.Color('#ff6ec7'),
    new THREE.Color('#c1a3ff'),
    new THREE.Color('#fffacd'),
];

for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 600 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = palette[(Math.random() * palette.length) | 0];
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 2.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    points.rotation.y = t * 0.05 + mouse.x * 0.4;
    points.rotation.x = Math.sin(t * 0.1) * 0.2 + mouse.y * 0.3;

    camera.position.x = Math.sin(t * 0.1) * 50;
    camera.position.y = Math.cos(t * 0.13) * 30;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
