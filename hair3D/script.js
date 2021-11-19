import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { TrackballControls } from './external/TrackballControls.js';
import { convertPositionBufferToVec3 } from './bufferFunctions.js';

export function main() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x545454);

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });

    // camera params
    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;


    const controls = new TrackballControls(camera, canvas);

    // head parameters
    const headRadius = 5
    // const geometry = new THREE.SphereGeometry(headRadius, 32, 16);
    const geometry = new THREE.BoxGeometry();
    // const geometry = new THREE.PlaneGeometry(1, 1);
    const head = makeInstances(scene,geometry, 0x44aa88, new THREE.Vector3(0, 0, 0));

    generateStrands(geometry);

    // lighting
    {
        const ambientLight = new THREE.AmbientLight(0x545454);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(-1, 2, 4);
        scene.add(directionalLight);
    }

    function render(time) {
        time *= 0.001;  // convert time to seconds

        controls.update();

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

function generateStrands(geometry) {
    var positionArray = convertPositionBufferToVec3(geometry.getAttribute('position'));
    console.log(positionArray);

}