import { ThreeElements } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { BufferAttribute, DoubleSide, Mesh, PlaneGeometry } from 'three';
import { waveSurface } from '../algorithms/WaveSurface';

const Surface = (props: ThreeElements['mesh']) => {
	const meshRef = useRef<Mesh>(null!);
	const ref = useRef<PlaneGeometry>(null!);

	const size = 100;
	const gridSize = 100;
	const stepSize = 1;
	const wireframe = false;
	const flatShading = true;

	const vertices: number[] = [];
	waveSurface(vertices, gridSize, stepSize, 10, 0.3);

	useEffect(() => {
		ref.current.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
	}, []);

	return (
		<mesh {...props} ref={meshRef}>
			<planeGeometry ref={ref} attach="geometry" args={[size, size, gridSize, gridSize]} />
			<meshPhongMaterial
				attach="material"
				color={'darkgreen'}
				side={DoubleSide}
				wireframe={wireframe}
				flatShading={flatShading}
			/>
		</mesh>
	);
};

export default Surface;
