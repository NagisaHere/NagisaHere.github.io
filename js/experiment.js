import '../css/experiment.css';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'; // used for title
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // for debug movement
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js' // for attaching css to 3d objects
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'; // animation library
import { gsap } from 'gsap'
import { Observer } from "gsap/all";
gsap.registerPlugin(Observer);

const CAMERA_DISTANCE = 75;
const CAM_MIN_DISTANCE = 0.1;
const CAM_MAX_DISTANCE = 1000;


const CAM_START_Z = 15

// icons refer to all 3d
// max scale of an ICON
const ICON_SCALE_FACTOR = 1.2

// how much to increment an icon when it grows
const ICON_SCALE_DIFF = 0.003;

// what scale the icon starts at
const ICON_DEFAULT_SCALE = 1;
const ICON_DEFAULT_ROTATION = 1.5;


const ICON_SPACE_FACTOR = 6

// radius of all 3d iocn objects
const ICON_RADIUS = 2;

const MOBILE_THRESHOLD = 768;

// how thick title is 
const TITLE_THICKNESS = 0.1;
const TITLE_SHAPES = 2;
const TITLE_POS = {x: 0, y: 5, z: 1};
const TITLE_LIGHT_POS = {x: 0, y: 4, z: 1};
const TITLE_LSTART_OPACITY = 0;
const TITLE_LEND_OPACITY = 0.4;
const TITLE_DSTART_OPACITY = 0;
const TITLE_DEND_OPACITY = 1;
const TITLE_ANIM_DURATION = 3;

// second text
const REVIEW_POS = {x: -5, y: -46, z: -5};
const REVIEW_LIGHT_POS = {x: -5, y: -44, z: -5};

const DEBUG = false;
const GENERATE_ITEMS = true;

const PAGE_SECTIONS = [
    { pos: { x: 0, y: 0, z: CAM_START_Z }, label: "Home" },
    { pos: { x: 0, y: -50, z: 10 }, label: "Course Review" },
    { pos: { x: 10, y: -100, z: 5 }, label: "Game" },
    { pos: { x: 10, y: -150, z: 5 }, label: "Social" }
];
const REVIEW_INDEX = 1;
const GAME_INDEX = 2;
const SOCIAL_INDEX = 3;


// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
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


// need to declare this so I can disable orbital controls outside of debug mode
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
// live chamith reaction
// TODO NEED TO ADD CSS2DRENDERER TO IT
const reactionTexture = new THREE.TextureLoader().load('../images/live.png')
const reaction = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map: reactionTexture})
);

scene.add(reaction);
bodyIcons.push(reaction)

function generateBoxes() {
    for (let i = 1; i < 3; i++) {
        const reactionTexture = new THREE.TextureLoader().load('../images/live.png')
        const reaction = new THREE.Mesh(
            new THREE.BoxGeometry(3,3,3),
            new THREE.MeshBasicMaterial({map: reactionTexture})
        );
        const boxTarget = PAGE_SECTIONS[i];
        reaction.position.set(boxTarget.x, boxTarget.y, boxTarget.z);
        scene.add(reaction);
    }


}
if (GENERATE_ITEMS) {
    generateBoxes();
}


// make text label for the text
const reactDiv = document.createElement('div');
reactDiv.className = 'label';
reactDiv.textContent = 'Click me!';
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
/*/
const bgTexture = new THREE.TextureLoader().load('../images/bgtheme7.jpg')
scene.background = bgTexture;*/

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


// LIGHTING SECTION
// amb light is universal, point is projected from a point
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(10, 10, 10);

const ambLight = new THREE.AmbientLight(0xffffff);

scene.add(pointlight);
/* generate title font */
/* text: string
    positionDark/positionLight: {x: val, y: val, z: val} */
function generateFont(font, text, positionDark, positionLight) {

    const color = new THREE.Color(0x006699);

    const matDark = new THREE.MeshBasicMaterial({
    color: color,
    opacity: TITLE_DSTART_OPACITY,
    side: THREE.DoubleSide
    });

    const matLite = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: TITLE_LSTART_OPACITY,
    side: THREE.DoubleSide
    });

    const message = text;

    const shapes = font.generateShapes(message, TITLE_SHAPES);

    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();

    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);

    // make shape (N.B. edge view not visible)
    // LIGHT TEXT GENERATION

    const lightText = new THREE.Mesh(geometry, matLite);
    
    lightText.position.set(0, -100, -100)
    lightText.rotation.y = 0.5
    scene.add(lightText);

    // make line shape (N.B. edge view remains visible).
    // webgl only has 1px lines so we need to trace along the curve
    // and construct a new shape that is thicker.

    const holeShapes = [];

    for (let i = 0; i < shapes.length; i++) {

    const shape = shapes[i];

    if (shape.holes && shape.holes.length > 0) {

        for (let j = 0; j < shape.holes.length; j ++) {

        const hole = shape.holes[j];
        holeShapes.push(hole);

        }

    }

    }

    shapes.push.apply(shapes, holeShapes);

    const style = SVGLoader.getStrokeStyle(TITLE_THICKNESS, color.getStyle());

    // DARK TEXT GENERATION

    const strokeText = new THREE.Group();

    for (let i = 0; i < shapes.length; i++) {

    const shape = shapes[i];

    const points = shape.getPoints();

    const geometry = SVGLoader.pointsToStroke(points, style);

    geometry.translate(xMid, 0, 0);

    const strokeMesh = new THREE.Mesh(geometry, matDark);
    strokeText.add(strokeMesh);

    }

    strokeText.position.set(0, -100, -100)
    strokeText.rotation.y = 0.5

    scene.add(strokeText);

    gsap.to(strokeText.position, { 
        ...positionDark, // funny spread operator
        duration: TITLE_ANIM_DURATION, 
        ease: "power3.out" 
    });
    gsap.to(lightText.position, { 
        ...positionLight, // funny spread operator
        duration: TITLE_ANIM_DURATION, 
        ease: "power3.out" 
    });
    gsap.to([matDark], { opacity: TITLE_DEND_OPACITY, duration: TITLE_ANIM_DURATION });
    gsap.to([matLite], { opacity: TITLE_LEND_OPACITY, duration: TITLE_ANIM_DURATION });
    renderer.render(scene, camera);


}

function drawTitle() {
    const loader = new FontLoader();
    loader.load('../fonts/Noto Sans JP_Regular.json', function(font) {
        generateFont(font,'  Ryan.Dev\nライアン    ', TITLE_POS, TITLE_LIGHT_POS);
        generateFont(font,'  Course\nReview    ', REVIEW_POS, REVIEW_LIGHT_POS);
    }); //end load function
}


/* old scrolling stuff
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
moveCamera(); */

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


var scaled = false;
var scaleDirection = false; // true to go big and false to go small ig
var scaleFactor = ICON_DEFAULT_SCALE;

// handle hover scaling
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

// page section control moment

let currentIndex = 0;
let isAnimating = false;

function goToNextSection() {
    // 1. Check if we are already moving or at the end
    if (isAnimating || currentIndex >= PAGE_SECTIONS.length - 1) return;

    isAnimating = true;
    currentIndex++;

    const target = PAGE_SECTIONS[currentIndex];
    // move to relevant section
    gsap.to(camera.position, {
        x: target.pos.x,
        y: target.pos.y,
        z: target.pos.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
            isAnimating = false; // Unlock after finished
            console.log("Arrived at:", target.label);
        }
    });
}

function goToPrevSection() {
    if (isAnimating || currentIndex <= 0) return;

    isAnimating = true;
    currentIndex--;

    const target = PAGE_SECTIONS[currentIndex];

    gsap.to(camera.position, {
        x: target.pos.x,
        y: target.pos.y,
        z: target.pos.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
            isAnimating = false;
        }
    });
}

// create task manager lmao
Observer.create({
  target: window,
  type: "wheel,touch",
  preventDefault: true,
  onDown: () => goToNextSection(),
  onUp: () => goToPrevSection(),
  tolerance: 30 // Prevent accidental tiny movements
});

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



    renderer.render(scene, camera);
    
    labelRenderer.render(scene, camera);
}

// arrange icons in a row
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

function arrIconsTwo() {
    // icons are reaction, github, linkedin, apa
    const tempPos = PAGE_SECTIONS[REVIEW_INDEX];
    reaction.position.set(4, tempPos.pos.y, 0);
}

drawTitle();
//arrIcons()
arrIconsTwo()
// call animate to the display
animate();
