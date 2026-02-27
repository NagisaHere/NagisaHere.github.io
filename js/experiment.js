import '../css/experiment.css';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'

const CAMERA_DISTANCE = 75;
const CAM_RATIO = 2/1;
const CAM_MIN_DISTANCE = 0.1;
const CAM_MAX_DISTANCE = 1000;
const CAM_START_Z = 15
const ICON_SCALE_FACTOR = 1.2
const ICON_SCALE_DIFF = 0.01
const ICON_DEFAULT_SCALE = 1
const MOBILE_THRESHOLD = 768;
const ICON_SPACE_FACTOR = 6
const ICON_RADIUS = 2;


// scene
const scene = new THREE.Scene();
// camera; distance, aspect ratio, min distance and max distance
const camera = new THREE.PerspectiveCamera(CAMERA_DISTANCE, window.innerWidth / window.innerHeight, CAM_MIN_DISTANCE, CAM_MAX_DISTANCE);
camera.position.z = CAM_START_Z;
// render (GL not Gl like me im stupid )
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// 2d rendered for text
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute'; // idk if this should be right
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // disable pointer stuff, otherwise mouse stuff is ded
document.body.appendChild(labelRenderer.domElement);


const DEBUG = false;
var controls = undefined;
if (DEBUG) {
    controls = new OrbitControls(camera, renderer.domElement);
}
const isMobile = window.innerWidth < MOBILE_THRESHOLD;

var bodyIcons = []

// mouse tracking so I can click things
// raycaster simply casts a laser from the camera view to wherever the mouse is
// if said laser collides with objects, then we get it to do stuff
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


// DEBUG mode
if (DEBUG) {
    const lightHelper = new THREE.GridHelper();
    scene.add(lightHelper)

}

// create objects and add

// title thingy
const loader = new FontLoader();
const font = await loader.loadAsync('../fonts/helvetiker_regular.typeface.json');
const titleGeometry = new TextGeometry( 'Ryan.dev', {
    font: font,
    size: 2,
    depth: 1,
    curveSegments: 12
} );
titleGeometry.center();
const titleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial) 
titleMesh.position.set(0, 8, 0)
titleMesh.rotation.x += 0.4;
scene.add(titleMesh)

// live chamith reaction
// TODO NEED TO ADD CSS2DRENDERER TO IT
const reactionTexture = new THREE.TextureLoader().load('../images/live.png')
const reaction = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map: reactionTexture})
);

scene.add(reaction);
bodyIcons.push(reaction)

const reactDiv = document.createElement('div');
reactDiv.className = 'label';
reactDiv.textContent = 'Course Review';
const reactLabel = new CSS2DObject(reactDiv);
reactLabel.position.set(0, 1.5, 0); // this is gonna be an issue since
// label needs to move with each thingy, maybe make it a tuple or struct idk
// im lazy
reaction.add(reactLabel);

// make it clickable
window.addEventListener('click', () => {
    // Fire the raycaster at the exact moment of the click
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([reaction]);

    // If the cube was clicked, open the URL
    if (intersects.length > 0) {
        window.open('https://threejs.org', '_blank'); // Opens in a new tab
    }
});

// le bgm
const bgTexture = new THREE.TextureLoader().load('../images/bgtheme7.jpg')
scene.background = bgTexture;

// github logo
const gitTexture = new THREE.TextureLoader().load('../images/github.png')
//const gitGeometry = new THREE.ExtrudeGeometry(new THREE.CircleGeometry(2, 32));
//const gitGeometry = new THREE.CircleGeometry(2, 32);
const gitGeometry = new THREE.CylinderGeometry(ICON_RADIUS, ICON_RADIUS, 0.5, 20)
const github = new THREE.Mesh(
    gitGeometry,
    new THREE.MeshBasicMaterial({map: gitTexture})
);
github.material.color.setHex(0xffffff);
github.rotation.x += 1.5
scene.add(github);
bodyIcons.push(github)

// github logo
const linkTexture = new THREE.TextureLoader().load('../images/linkedin.png')

const linkedin = new THREE.Mesh(
    new THREE.CircleGeometry(ICON_RADIUS, 32),
    new THREE.MeshBasicMaterial({map:linkTexture})
);
scene.add(linkedin);
bodyIcons.push(linkedin)

// add light
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(5, 5, 5);

const ambLight = new THREE.AmbientLight(0xffffff);

scene.add(pointlight);

var scaled = false;
var scaleDirection = false; // true to go big and false to go small ig
var scaleFactor = ICON_DEFAULT_SCALE;

function checkHover() {
    // update raycast from cam to mouse
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    // pass array of objs we want to check for
    const intersects = raycaster.intersectObjects([reaction]);

    if (intersects.length > 0) {
        // HOVER IS ACTIVE
        // this shouldnt activate on first load
        if (!scaled) {

            //reaction.scale.set(ICON_SCALE_FACTOR, ICON_SCALE_FACTOR, ICON_SCALE_FACTOR);
            scaled = true;
        }
        scaleChamith();
        document.body.style.cursor = 'pointer'; 
    } else {
        // HOVER IS INACTIVE
        reaction.material.color.setHex(0xffffff); // white
        document.body.style.cursor = 'default';
        if (scaled) {
            reaction.scale.set(ICON_DEFAULT_SCALE, ICON_DEFAULT_SCALE, ICON_DEFAULT_SCALE);
            scaled = false;
        }
    }
}

function spinChamith() {
    reaction.rotation.x += 0.01;
    reaction.rotation.y += 0.005
    reaction.rotation.z += 0.0001;

}

function scaleChamith() {
    if (scaleDirection) {
        // go bigger
        scaleFactor += ICON_SCALE_DIFF;
        if (scaleFactor > ICON_SCALE_FACTOR) {
            scaleDirection = !scaleDirection;
        }
    } else {
        scaleFactor -= ICON_SCALE_DIFF;
        if (scaleFactor < ICON_DEFAULT_SCALE) {
            scaleDirection = !scaleDirection;
        }
    }
    reaction.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

function spinGit() {
    github.rotation.y += 0.02
}

function spinIcons() {
    spinChamith();
    spinGit();
}

// animate
function animate() {
    requestAnimationFrame(animate);

    // stuff to animate here
    spinIcons();
    checkHover();
    if (DEBUG) {
        controls.update()
    }
    renderer.render(scene, camera);
}

// arrange icons
function arrIcons() {
    bodyIcons.forEach((mesh, index) => {
        mesh.position.set(0, 0, 0)
        if (isMobile) {
            // verrrrr
            mesh.position.y = (1 - index) * ICON_SPACE_FACTOR;
        } else {
            // horrrrrr
            mesh.position.x = (index - 1) * ICON_SPACE_FACTOR;
        }
    })
}

arrIcons()
// call animate to the display
animate();

// maybe make it clickable?
// may need to use window.open(something.url) where something.url is ./local.html or smth
