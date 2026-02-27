import '../css/experiment.css';
import * as THREE from 'three';

const CAMERA_DISTANCE = 75;
const CAM_RATIO = 2/1;
const CAM_MIN_DISTANCE = 0.1;
const CAM_MAX_DISTANCE = 1000;
const CAM_START_Z = 15
// scene
const scene = new THREE.Scene();
// camera; distance, aspect ratio, min distance and max distance
const camera = new THREE.PerspectiveCamera(CAMERA_DISTANCE, window.innerWidth / window.innerHeight, CAM_MIN_DISTANCE, CAM_MAX_DISTANCE);
camera.position.z = CAM_START_Z;
// render (gl)
const renderer = new THREE.WebGlRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


// create objects

const reactionTexture = new THREE.TextureLoader().load('../images/live.png')
const reaction = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map: reactionTexture})
);

scene.add(reaction)

// add objects

// add light
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(5, 5, 5);
scene.add(pointlight);

// animate
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// call animate to the display
animate();

// maybe make it clickable?
// may need to use window.open(something.url) where something.url is ./local.html or smth
