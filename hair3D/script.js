import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { TrackballControls } from './external/TrackballControls.js';
import { convertBufferToVec3 } from './bufferFunctions.js';
import { Hair } from './hair.js';

export function main() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x545454);

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // camera params
    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;
    camera.position.y = -5;


    const controls = new TrackballControls(camera, canvas);

    // head parameters
    const headRadius = 5
    // const geometry = new THREE.SphereGeometry(headRadius, 32, 16);
    const geometry = new THREE.BoxGeometry();
    // const geometry = new THREE.PlaneGeometry(1, 1);
    const head = makeInstances(scene, geometry, 0x44aa88, new THREE.Vector3(0, 0, 0));

    const hair = generateHair(head);

    // lighting
    {
        const ambientLight = new THREE.AmbientLight(0x545454);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(-1, 2, 4);
        scene.add(directionalLight);
    }

    var prevTime = 0;
    function render(time) {
        time *= 0.001;  // convert time to seconds
        const deltaTime = time -prevTime;
        prevTime = time;
        
        controls.update();
        hair.simulateStep(deltaTime);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

function makeInstances(scene, geometry, color, position) {
    const material = new THREE.MeshPhongMaterial({ color });

    const instance = new THREE.Mesh(geometry, material);
    scene.add(instance);
    instance.position.copy(position);

    return instance;
}

function generateHair(instance) {
    const positionArray = convertBufferToVec3(instance.geometry.getAttribute('position'));
    const normalArray = convertBufferToVec3(instance.geometry.getAttribute('normal'));
    const hair = new Hair(positionArray, normalArray, 'tomato', { numSegments: 5 });

    instance.add(hair);
    hair.init();

    return hair;
}