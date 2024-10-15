import { Canvas, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import { Suspense } from 'react';
import { Environment, OrbitControls } from '@react-three/drei';

const CameraAnimation = () => {
  const { camera } = useThree();
  camera.position.set(0, 0.4, 12);
  camera.lookAt(0, 0, 0);

  return null;
};

const Model = () => {
  // Charger le modèle GLB et la texture
  const gltf = useLoader(GLTFLoader, '/card.glb');
  const texture = useLoader(TextureLoader, '/card/textures/texture.png');

  // Appliquer la texture sur le modèle
  gltf.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.map = texture;
      child.material.metalness = 1;
      child.material.roughness = 0.2;
    }
  });

  return <primitive object={gltf.scene} scale={0.5} />;
};

const CardSliderGLB = () => {
  return (
    <div className='w-screen h-screen fixed inset-0 bg-[#000000d8]'>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          <directionalLight position={[-8, -8, 5]} intensity={2} />
          <directionalLight position={[5, 5, 9]} intensity={5} />
          <CameraAnimation />
          <Model />
          {/* Environnement HDR pour de meilleurs reflets */}
          <OrbitControls />{' '}
          {/* Pour pouvoir manipuler la caméra avec la souris */}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CardSliderGLB;
