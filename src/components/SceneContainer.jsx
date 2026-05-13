import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, TorusKnot, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';

const PlaceholderModel = () => {
  // This is just a cool looking placeholder.
  // Replace this component with your actual GLTF model later.
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <TorusKnot args={[1, 0.3, 128, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial 
                color="#00d8ff" 
                roughness={0.1} 
                metalness={0.8}
                wireframe={false}
            />
        </TorusKnot>
    </Float>
  );
};

const SceneContainer = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-screen -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#121212']} />
        {/* Suspense handles async loading of models/environments */}
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          {/* Environment reflection map gives realistic metallic looks */}
          <Environment preset="city" />

          {/* The 3D Object */}
          <PlaceholderModel />

          {/* Shadows on the "ground" beneath the object */}
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
          
          {/* Allows user to rotate the view gently */}
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneContainer;
