import { useGSAP } from '@gsap/react';
import { Environment } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Group, Mesh, Vector3 } from 'three';
import Model from './Model';

const cardGLTF = [
  '/credit_card1/scene.gltf',
  '/credit_card2/scene.gltf',
  '/credit_card3/scene.gltf',
  '/credit_card4/scene.gltf',
  '/credit_card5/scene.gltf',
  '/credit_card6/scene.gltf',
];

const CameraAnimation = () => {
  const { camera } = useThree();
  camera.position.set(0, 3, 13);
  camera.lookAt(0, 0, 0);

  return null;
};

const Plane = ({
  position,
  onClick,
  pathGLTF,
  isSelected,
}: {
  position?: Vector3;
  onClick?: () => void;
  pathGLTF: string;
  isSelected: boolean;
}) => {
  const planeRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useGSAP(() => {
    if (!groupRef.current) return;

    gsap.to(groupRef.current.rotation, {
      y: isSelected ? Math.PI / 2 : 0,
      duration: 1,
      ease: 'power3.inOut',
    });
  }, [isSelected]);

  useEffect(() => {
    if (!planeRef.current) return;
    planeRef.current.lookAt(0, 0, 0);
    if (!groupRef.current) return;
    groupRef.current.rotation.y = isSelected ? Math.PI / 2 : 0;
  }, []);

  return (
    <group position={position} ref={groupRef} onClick={onClick}>
      <Model ref={planeRef} pathGLTF={pathGLTF} />
    </group>
  );
};

const CardSlider = () => {
  const [activeCard, setActiveCard] = useState(0);
  const groupRef = useRef<Group>(null);

  const TOTAL_CARDS = cardGLTF.length;
  const RADIUS = 4;

  const getPosition = (index: number, totalCards: number, radius: number) => {
    const angle = (index / totalCards) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = 0;
    const z = Math.sin(angle) * radius;

    return new Vector3(x, y, z);
  };

  const rotateCarousel = (index: number) => {
    if (!groupRef.current || gsap.isTweening(groupRef.current.rotation)) return;

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
      ease: 'power3.inOut',
    });
  };

  return (
    <div className='w-screen h-screen fixed inset-0 bg-black'>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <directionalLight position={[-8, -8, 5]} intensity={5} />
        <directionalLight position={[5, 5, 9]} intensity={10} />
        <CameraAnimation />
        <group ref={groupRef} rotation={[0, -1.57, 0]}>
          {cardGLTF.map((pathGLTF, index) => (
            <Plane
              key={index}
              position={getPosition(index, TOTAL_CARDS, RADIUS)}
              onClick={() => rotateCarousel(index)}
              pathGLTF={pathGLTF}
              isSelected={activeCard === index}
            />
          ))}
        </group>
        {/* <OrbitControls /> */}
        <Environment files='/environement2.exr' background={false} />
      </Canvas>
      <div className='fixed bottom-10 left-1/2 -translate-x-1/2 gap-3 flex'>
        {[...Array(TOTAL_CARDS)].map((_, index) => (
          <button
            key={index}
            className='px-8 py-1 backdrop-blur-lg rounded-full bg-[#ffffff50] text-slate-300 whitespace-nowrap uppercase text-sm'
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
