import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeElements, useFrame } from '@react-three/fiber';

const Box = (props: ThreeElements['mesh']) => {
	const meshRef = useRef<THREE.Mesh>(null!); // eslint-disable-line
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	useFrame((state, delta) => (meshRef.current.rotation.x += delta));

	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={() => setActive(!active)}
			onPointerOver={() => setHover(true)}
			onPointerOut={() => setHover(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	);
};

export default Box;
