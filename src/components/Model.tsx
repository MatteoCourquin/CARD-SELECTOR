import { useLoader } from '@react-three/fiber';
import { forwardRef, useEffect, useState } from 'react';
import { Box3, Group, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

type ModelProps = {
  pathGLTF: string;
};

const Model = forwardRef<Mesh, ModelProps>(
  ({ pathGLTF }: { pathGLTF: string }, ref) => {
    const gltf = useLoader(GLTFLoader, pathGLTF);
    const [isCentered, setIsCentered] = useState(false);

    useEffect(() => {
      if (!isCentered) {
        const box = new Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new Vector3());

        gltf.scene.position.z -= center.z;
        setIsCentered(true);
      }
    }, [gltf, isCentered]);

    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.metalness = 0.8;
        child.material.roughness = 0.2;
      }
    });

    const pivot = new Group();
    pivot.add(gltf.scene);

    return (
      <mesh ref={ref}>
        <primitive object={pivot} position={[0, 0, 0]} scale={0.5} />
      </mesh>
    );
  }
);

export default Model;
