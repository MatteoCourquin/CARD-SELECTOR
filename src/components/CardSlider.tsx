import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useRef } from 'react';
import * as THREE from 'three';

const CameraAnimation = () => {
  const { camera } = useThree();

  camera.position.set(0, 0.4, 12);
  camera.lookAt(0, 0, 0);

  return null;
};

const Plane = ({
  position,
  textureUrl,
  onClick,
}: {
  position: any;
  textureUrl: string;
  onClick?: () => void;
}) => {
  const { camera } = useThree();
  const planeRef = useRef<THREE.Mesh>(null);

  const texture = new THREE.TextureLoader().load(textureUrl);

  useFrame(() => {
    if (!planeRef.current) return;
    planeRef.current.lookAt(camera.position.x, 0, camera.position.z);
  });

  return (
    <mesh position={position} ref={planeRef} onClick={onClick}>
      <planeGeometry args={[5, 3]} />
      <meshPhysicalMaterial
        map={texture}
        transparent={true}
        // ior={1.1}
        reflectivity={1}
        // thickness={0.1}
        roughness={0.5}
        metalness={1}
      />
    </mesh>
  );
};

const CardSlider = () => {
  const groupRef = useRef<THREE.Group>(null);

  const getPosition = (index: number, total: number, radius: number) => {
    const angle = (index * (2 * Math.PI)) / total;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  };

  const rotateCarousel = (index: number) => {
    const angle = (index * (2 * Math.PI)) / 3;

    if (!groupRef.current) return;

    gsap.to(groupRef.current.rotation, {
      y: -(angle + 1.57),
      duration: 1,
      ease: 'power2.inOut',
    });
  };

  const radius = 4;
  return (
    <div className='w-screen h-screen fixed inset-0 bg-[#000000d8]'>
      <Canvas style={{ width: '100%', height: '100%' }}>
        {/* <ambientLight intensity={8} /> */}
        <directionalLight position={[-8, -8, 5]} intensity={2} />
        <directionalLight position={[5, 5, 9]} intensity={5} />

        <CameraAnimation />
        <group ref={groupRef} rotation={[0, -1.57, 0]}>
          <Plane
            position={getPosition(0, 3, radius)}
            textureUrl='fosfo.png'
            onClick={() => rotateCarousel(0)}
          />
          <Plane
            position={getPosition(2, 3, radius)}
            textureUrl='gold.png'
            onClick={() => rotateCarousel(1)}
          />
          <Plane
            position={getPosition(1, 3, radius)}
            textureUrl='world-elite.png'
            onClick={() => rotateCarousel(2)}
          />
          <OrbitControls />
        </group>
      </Canvas>
      <div className='fixed bottom-10 left-1/2 -translate-x-1/2 gap-4 flex'>
        <button
          className='px-8 py-1 backdrop-blur-3xl rounded-full bg-[#ffffff50] text-white'
          onClick={() => rotateCarousel(0)}
        >
          fosfo
        </button>
        <button
          className='px-8 py-1 backdrop-blur-3xl rounded-full bg-[#ffffff50] text-white'
          onClick={() => rotateCarousel(1)}
        >
          gold
        </button>
        <button
          className='px-8 py-1 backdrop-blur-3xl rounded-full bg-[#ffffff50] text-white'
          onClick={() => rotateCarousel(2)}
        >
          world elite
        </button>
      </div>
    </div>
  );
};

export default CardSlider;
