import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CameraAnimation = () => {
  const { camera } = useThree();
  camera.position.set(0, 1, 12);
  camera.lookAt(0, 0, 0);

  return null;
};

const Plane = ({
  position,
  onClick,
  isSelected,
}: {
  position?: THREE.Vector3;
  onClick?: () => void;
  isSelected: boolean;
}) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    gsap.to(groupRef.current.rotation, {
      y: isSelected ? Math.PI / -2 : 0,
      duration: 1,
      ease: 'power2.inOut',
    });
  }, [isSelected]);

  useEffect(() => {
    if (!planeRef.current) return;

    planeRef.current.lookAt(0, 0, 0);
    planeRef.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  }, []);

  return (
    <group position={position} ref={groupRef} onClick={onClick}>
      <mesh ref={planeRef}>
        <planeGeometry args={[5, 3]} />
        <meshPhysicalMaterial
          transparent={true}
          reflectivity={1}
          roughness={0.5}
          metalness={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const CardSlider = () => {
  const [activeCard, setActiveCard] = useState(0);

  const groupRef = useRef<THREE.Group>(null);

  const TOTAL_CARDS = 6;
  const RADIUS = 4;

  const getPosition = (index: number, totalCards: number, radius: number) => {
    const angle = (index / totalCards) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = 0;
    const z = Math.sin(angle) * radius;

    return new THREE.Vector3(x, y, z);
  };

  const rotateCarousel = (index: number) => {
    if (!groupRef.current) return;

    const currentAngle = (activeCard * (2 * Math.PI)) / TOTAL_CARDS;
    const targetAngle = (index * (2 * Math.PI)) / TOTAL_CARDS;

    let deltaAngle = targetAngle - currentAngle;

    if (deltaAngle > Math.PI) {
      deltaAngle -= 2 * Math.PI;
    } else if (deltaAngle < -Math.PI) {
      deltaAngle += 2 * Math.PI;
    }

    setActiveCard(index);

    gsap.to(groupRef.current.rotation, {
      y: `+=${deltaAngle}`,
      duration: 1,
      ease: 'power2.inOut',
    });
  };

  return (
    <div className='w-screen h-screen fixed inset-0 bg-[#000000d8]'>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <directionalLight position={[-8, -8, 5]} intensity={2} />
        <directionalLight position={[5, 5, 9]} intensity={5} />
        <CameraAnimation />
        <group ref={groupRef} rotation={[0, -1.57, 0]}>
          {[...Array(TOTAL_CARDS)].map((_, index) => (
            <Plane
              key={index}
              position={getPosition(index, TOTAL_CARDS, RADIUS)}
              onClick={() => rotateCarousel(index)}
              isSelected={activeCard === index}
            />
          ))}
          <OrbitControls />
        </group>
      </Canvas>
      <div className='fixed bottom-10 left-1/2 -translate-x-1/2 gap-4 flex'>
        {[...Array(TOTAL_CARDS)].map((_, index) => (
          <button
            key={index}
            className='px-8 py-1 backdrop-blur-3xl rounded-full bg-[#ffffff50] text-white'
            onClick={() => rotateCarousel(index)}
          >
            Card {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardSlider;
