import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { Suspense } from 'react';
import { Mesh } from 'three';
import { GLTFLoader } from 'three-stdlib';

const CameraAnimation = () => {
  const { camera } = useThree();
  camera.position.set(0, 0.4, 12);
  camera.lookAt(0, 0, 0);

  return null;
};

const Model = () => {
  const gltf = useLoader(GLTFLoader, '/credit_card/scene.gltf');

  gltf.scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.material.metalness = 0.8;
      child.material.roughness = 0.2;
    }
  });

  gsap.to(gltf.scene.rotation, {
    y: Math.PI * 2,
    duration: 60,
    repeat: -1,
    ease: 'none',
  });

  return (
    <primitive
      object={gltf.scene}
      position={[0, 0, 0]}
      rotation={[0, -90, 0]}
      scale={0.5}
    />
  );
};

const CardViewerGLTF = () => {
  return (
    <div className='w-screen h-screen fixed inset-0 bg-[#000000d8]'>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          <directionalLight position={[-8, -8, 5]} intensity={2} />
          <directionalLight position={[1, 1, 9]} intensity={5} />
          <CameraAnimation />
          <Model />
          <Environment files='/environement2.exr' background={true} />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CardViewerGLTF;
