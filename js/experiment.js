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
const ICON_SCALE_DIFF = 0.003;
const ICON_DEFAULT_SCALE = 1;
const ICON_DEFAULT_ROTATION = 1.5;
const MOBILE_THRESHOLD = 768;
const ICON_SPACE_FACTOR = 6
const ICON_RADIUS = 2;
const DEBUG = false;

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

const titleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,         // Base color (keep white for clear glass)
    metalness: 0.1,          // A tiny bit of metalness enhances reflections
    roughness: 0.0,          // 0 = perfectly smooth and glossy
    transmission: 0.5,       // 1 = fully act like glass (refracts light)
    ior: 1.5,                // Index of Refraction (1.5 is standard glass)
    thickness: 1.5,          // How deep the glass is (adjust based on text depth)
    dispersion: 1.0,         // Creates the rainbow chromatic aberration!
    clearcoat: 1.0           // Adds an extra layer of glossy polish
});

const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial) 
titleMesh.position.set(0, 8, 0)
titleMesh.rotation.x += 0.4;


// invisible pthingy
const invisiblePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
if (DEBUG) {
    const helper = new THREE.PlaneHelper( invisiblePlane, 1, 0xffff00 );
    scene.add( helper );
}

// used to track intersection with plane idfk
const targetPosition = new THREE.Vector3();

scene.add(titleMesh);

// 1. Create an invisible dummy object
const dummy = new THREE.Object3D();

// 2. Define your limits in Radians (e.g., limit it to 45 degrees left and right)
const maxTurnRight = THREE.MathUtils.degToRad(30);
const maxTurnLeft = THREE.MathUtils.degToRad(-30);

const maxTiltUp = THREE.MathUtils.degToRad(0);
const maxTiltDown = THREE.MathUtils.degToRad(0);


// live chamith reaction
// TODO NEED TO ADD CSS2DRENDERER TO IT
const reactionTexture = new THREE.TextureLoader().load('../images/live.png')
const reaction = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map: reactionTexture})
);

scene.add(reaction);
bodyIcons.push(reaction)

// make text label for the text
const reactDiv = document.createElement('div');
reactDiv.className = 'label';
reactDiv.textContent = 'Course Review';
const reactLabel = new CSS2DObject(reactDiv);
reactLabel.position.set(0, 3, 0); // this is gonna be an issue since
// label needs to move with each thingy, maybe make it a tuple or struct idk
// im lazy
reaction.add(reactLabel);
reactLabel.visible = false;

// make it clickable
window.addEventListener('click', () => {
    // Fire the raycaster at the exact moment of the click
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([reaction]);

    // If the cube was clicked, open the URL
    if (intersects.length > 0) {
        window.location.href = '../review.html'; // non new tab 
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
github.rotation.x += ICON_DEFAULT_ROTATION;
scene.add(github);
bodyIcons.push(github)

// linkedin
const linkTexture = new THREE.TextureLoader().load('../images/linkedin.png')
const linkGeometry = new THREE.CylinderGeometry(ICON_RADIUS, ICON_RADIUS, 0.5, 20)

const linkedin = new THREE.Mesh(
    linkGeometry,
    new THREE.MeshBasicMaterial({map:linkTexture})
);
linkedin.rotation.x += ICON_DEFAULT_ROTATION;
scene.add(linkedin);
bodyIcons.push(linkedin)

// genki thingy
const genkiTexture = new THREE.TextureLoader().load('../images/APA.png')
//const genkiGeometry = new THREE.ExtrudeGeometry(new THREE.CircleGeometry(2, 32));
//const genkiGeometry = new THREE.CircleGeometry(2, 32);
const genkiGeometry = new THREE.SphereGeometry(ICON_RADIUS, 32, 16);
const genki = new THREE.Mesh(
    genkiGeometry,
    new THREE.MeshBasicMaterial({map: genkiTexture})
);
genki.material.color.setHex(0xffffff);
genki.rotation.x += 1.5;
scene.add(genki);
bodyIcons.push(genki)

// apa game thingy



// add light
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(10, 10, 10);

const ambLight = new THREE.AmbientLight(0xffffff);

scene.add(pointlight);

var scaled = false;
var scaleDirection = false; // true to go big and false to go small ig
var scaleFactor = ICON_DEFAULT_SCALE;

// scrolling stuff
function moveCamera() {
    // track where user has scrolled to from the very top of page
    const t = document.body.getBoundingClientRect().top;

    // do some funny stuff with icons here idk

    // move camera by negative ammount since top is always negative
    camera.position.z = CAM_START_Z + (t * -0.1);
    camera.position.y = t * 0.1;
    //camera.position.x = t * -0.02;
}

document.body.onscroll = moveCamera;
moveCamera();

// ANIMATIONS FOR RENDERING OBJECTS
function addLabel(labelName, objToLabel) {
    const reactDiv = document.createElement('div');
    reactDiv.className = 'label';
    reactDiv.textContent = labelName;
    const reactLabel = new CSS2DObject(reactDiv);
    reactLabel.position.set(0, 1.5, 0); // this is gonna be an issue since
    // label needs to move with each thingy, maybe make it a tuple or struct idk
    // im lazy
    objToLabel.add(reactLabel);
    return reactLabel
}

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
            reactLabel.visible = true;
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
            //reaction.remove(reactLabel)
            reactLabel.visible = false;

        }
    }
}

function spinChamith() {
    reaction.rotation.x += 0.01;
    reaction.rotation.y += 0.005
    reaction.rotation.z += 0.0001;
}

// return next scale direction??
function scaleObjectLoop(objToScale) {

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
// seems to run faster on better monitors
function animate() {
    requestAnimationFrame(animate);

    // stuff to animate here
    spinIcons();
    checkHover();
    if (DEBUG) {
        controls.update()
    }

// 1. Fire the raycaster from the camera through the mouse position
    raycaster.setFromCamera(mouse, camera);

    // 2. Calculate exactly where that ray hits our invisible wall
    // It stores the resulting X,Y,Z coordinates inside 'targetPosition'
    raycaster.ray.intersectPlane(invisiblePlane, targetPosition);

    // 1. Move the dummy to the exact same position as your real text
    dummy.position.copy(titleMesh.position);

    // 2. Let the dummy freely look at the mouse
    dummy.lookAt(targetPosition);

    // 3. CLAMPING THE ROTATION
    // Take the dummy's Y rotation, force it within our limits, and apply it to the text
    titleMesh.rotation.y = THREE.MathUtils.clamp(
        dummy.rotation.y, 
        maxTurnLeft, 
        maxTurnRight
    );

    // Do the exact same thing for the up/down tilt (X axis)
    titleMesh.rotation.x = THREE.MathUtils.clamp(
        dummy.rotation.x, 
        maxTiltDown, 
        maxTiltUp
    );

    // Lock the Z axis so the text doesn't barrel-roll
    titleMesh.rotation.z = 0;

    renderer.render(scene, camera);
    
    labelRenderer.render(scene, camera);
}

// arrange icons
function arrIcons() {
    bodyIcons.forEach((mesh, index) => {
        mesh.position.set(0, 0, 0)
        if (isMobile) {
            // verrrrr
            mesh.position.y = (-index) * ICON_SPACE_FACTOR;
        } else {
            // horrrrrr
            mesh.position.x = (index - 1.5) * ICON_SPACE_FACTOR;
        }
    })
}

arrIcons()
// call animate to the display
animate();

// maybe make it clickable?
// may need to use window.open(something.url) where something.url is ./local.html or smth
