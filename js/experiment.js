import '../css/experiment.css';
import * as THREE from 'three';

const CAMERA_DISTANCE = 75;
const CAM_RATIO = 2/1;
const CAM_MIN_DISTANCE = 0.1;
const CAM_MAX_DISTANCE = 1000;
const CAM_START_Z = 15
const ICON_SCALE_FACTOR = 1.2
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




// create objects and add
// live chamith reaction
const reactionTexture = new THREE.TextureLoader().load('../images/live.png')
const reaction = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map: reactionTexture})
);

scene.add(reaction);
bodyIcons.push(reaction)

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
const bgTexture = new THREE.TextureLoader().load('../images/bgtheme6.jpg')
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
scene.add(pointlight);

var scaled = false;

function checkHover() {
    // update raycast from cam to mouse
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    // pass array of objs we want to check for
    const intersects = raycaster.intersectObjects([reaction]);

    if (intersects.length > 0) {
        // HOVER IS ACTIVE
        // this shouldnt activate on first load
        reaction.material.color.setHex(0xff0000); // Change to red for now
        if (!scaled) {

            reaction.scale.set(ICON_SCALE_FACTOR, ICON_SCALE_FACTOR, ICON_SCALE_FACTOR);
            scaled = true;
        }
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
