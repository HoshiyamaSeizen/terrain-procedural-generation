import { ThreeElements } from '@react-three/fiber';
import React, { Ref, forwardRef, useEffect, useRef } from 'react';
import { BufferAttribute, DoubleSide, PlaneGeometry } from 'three';
import { waveSurface } from '../algorithms/WaveSurface';
import { simplexNoiseTerrain } from '../algorithms/SimplexNosie';
import SurfaceMaterial from '../materials/SurfaceMaterial';

type TerrainType = 'WAVE' | 'SIMPLEX';

const Surface = ({ type, ...props }: { type: TerrainType } & ThreeElements['group']) => {
	const ref = useRef<PlaneGeometry>(null!);
	const sideRefs = [
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
	];

	const size = 50;
	const wireframe = false;
	const textures = true;
	const flatShading = false;
	const color = 'darkgreen';
	const amplitude = 0.2;
	const scale = 1;
	const levels = 8;

	const vertices: number[] = [];
	if (type === 'WAVE') waveSurface(vertices, size, amplitude, scale, 0.3);
	if (type === 'SIMPLEX') simplexNoiseTerrain(vertices, size, amplitude, scale, levels);

	const sides: [number[], number[], number[], number[]] = [[], [], [], []];
	for (let i = 0; i < size * size; i++) {
		const [x, y, z] = vertices.slice(3 * i, 3 * i + 3);
		const addLine = (side: number[]) => side.push(x, y, z, x, 0, z);

		if (i < size) addLine(sides[0]);
		if (i >= size * (size - 1)) addLine(sides[1]);
		if (i % size === 0) addLine(sides[2]);
		if ((i + 1) % size === 0) addLine(sides[3]);
	}

	useEffect(() => {
		ref.current.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
		ref.current.computeVertexNormals();
		sideRefs.forEach((ref, i) =>
			ref.current.setAttribute('position', new BufferAttribute(new Float32Array(sides[i]), 3))
		);
	}, []);

	const Side = forwardRef<PlaneGeometry, { ref: Ref<PlaneGeometry> }>((props, ref) => (
		<mesh>
			<planeGeometry args={[1, 1, 1, size - 1]} ref={ref} />
			<meshBasicMaterial color="black" wireframe={wireframe} side={DoubleSide} />
		</mesh>
	));
	Side.displayName = 'Side';

	const Bottom = () => (
		<mesh
			rotation-x={Math.PI / 2}
			scale={((size - 1) / size) * scale}
			position={[-scale / size / 2, 0, -scale / size / 2]}
		>
			<planeGeometry args={[1, 1, 1, 1]} />
			<meshBasicMaterial color="black" wireframe={wireframe} side={DoubleSide} />
		</mesh>
	);

	return (
		<group {...props} scale={1 / scale}>
			<mesh>
				<planeGeometry ref={ref} attach="geometry" args={[1, 1, size - 1, size - 1]} />
				{textures ? (
					<SurfaceMaterial attach="material" side={1} />
				) : (
					<meshPhongMaterial
						attach="material"
						color={color}
						side={DoubleSide}
						wireframe={wireframe}
						flatShading={flatShading}
					/>
				)}
			</mesh>
			{sideRefs.map((ref, i) => (
				<Side ref={ref} key={i} />
			))}
			<Bottom />
		</group>
	);
};

export default Surface;
