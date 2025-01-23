'use client'

import { DrawScene } from "./Three";

const Background = () => {
    DrawScene();
    return (
        <canvas className="fixed top-0 left-0"
            id="bg">
                
        </canvas>
    );
}

export default Background;