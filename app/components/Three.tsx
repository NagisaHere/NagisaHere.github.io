'use client'

import * as THREE from 'three';
import useWindowSize from './hooks/useWindowSize';

export function DrawScene() {
    const scene = new THREE.Scene();

    const size = useWindowSize();
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
        // document not defined but why
        canvas: document.querySelector('#bg'),
    })

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size.width, size.height);

    // raise z-axis to get a better perspective
    camera.position.setZ(30);

    renderer.render(scene, camera);
}
