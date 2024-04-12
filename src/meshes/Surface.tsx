import { ThreeElements } from '@react-three/fiber';
import React, { Ref, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { BufferAttribute, DoubleSide, PlaneGeometry } from 'three';
import { waveSurface } from '../algorithms/WaveSurface';
import { generateNoise, noiseTerrain } from '../algorithms/NoiseSurface';
import SurfaceMaterial from '../materials/SurfaceMaterial';
import { button, useControls } from 'leva';

type TerrainType = 'WAVE' | 'SIMPLEX';

const Surface = ({ type, ...props }: { type: TerrainType } & ThreeElements['group']) => {
	const ref = useRef<PlaneGeometry>(null!);
	const sideRefs = [
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
	];
	const { size, scale, levels, amplitude, wireframe, textures } = useControls({
		'Generate New': button(() => setSeed(Date.now())),
		size: { value: 50, min: 2, max: 400, step: 2 },
		scale: { value: 1, min: 1, max: 10, step: 1 },
		levels: { value: 3, min: 1, max: 10, step: 1 },
		amplitude: { value: 0.2, min: 0, max: 1, step: 0.05 },
		wireframe: { value: false },
		textures: { value: true },
	});

	const [seed, setSeed] = useState(0);
	const noise = useMemo(() => generateNoise(), [seed]);

	const flatShading = false;
	const color = 'darkgreen';

	useEffect(() => {
		const vertices: number[] = [];
		if (type === 'WAVE') waveSurface(vertices, size, amplitude, scale, 0.3);
		if (type === 'SIMPLEX') noiseTerrain(noise, vertices, size, amplitude, scale, levels);

		const sides: [number[], number[], number[], number[]] = [[], [], [], []];
		for (let i = 0; i < size * size; i++) {
			const [x, y, z] = vertices.slice(3 * i, 3 * i + 3);
			const addLine = (side: number[]) => side.push(x, y, z, x, 0, z);

			if (i < size) addLine(sides[0]);
			if (i >= size * (size - 1)) addLine(sides[1]);
			if (i % size === 0) addLine(sides[2]);
			if ((i + 1) % size === 0) addLine(sides[3]);
		}

		ref.current.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
		ref.current.computeVertexNormals();
		sideRefs.forEach((ref, i) =>
			ref.current.setAttribute('position', new BufferAttribute(new Float32Array(sides[i]), 3))
		);
	}, [size, scale, levels, amplitude, wireframe, textures, noise]);

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
				{!wireframe && textures ? (
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
