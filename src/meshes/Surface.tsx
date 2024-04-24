import { ThreeElements } from '@react-three/fiber';
import React, { Ref, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { BufferAttribute, DoubleSide, PlaneGeometry } from 'three';
import { waveSurface } from '../algorithms/WaveSurface';
import { generateNoise, noiseTerrain } from '../algorithms/NoiseSurface';
import SurfaceMaterial from '../materials/SurfaceMaterial';
import { button, folder, useControls } from 'leva';
import { forceDirectedTerrain, getHistory } from '../algorithms/FDA';

type TerrainType = 'WAVE' | 'SIMPLEX' | 'FDA';

const Surface = ({ type, ...props }: { type: TerrainType } & ThreeElements['group']) => {
	const ref = useRef<PlaneGeometry>(null!);
	const sideRefs = [
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
		useRef<PlaneGeometry>(null!),
	];
	const state = useControls({
		'Generate New': button(() => setSeed(Date.now())),
		FDA: folder({
			iterations: { value: 1, min: 0, max: 10, step: 1 },
			k_g: { value: 0.05, min: 0, max: 0.2, step: 0.01 },
			k_s: { value: 0.1, min: 0, max: 0.2, step: 0.01 },
			k_r: { value: 0.04, min: 0, max: 0.2, step: 0.01 },
			reach: { value: 10, min: 0, max: 20, step: 1 },
		}),
		'Initial Terrain': folder({
			size: { value: 50, min: 2, max: 70, step: 2 },
			scale: { value: 1, min: 1, max: 10, step: 1 },
			levels: { value: 3, min: 1, max: 10, step: 1 },
			amplitude: { value: 0.2, min: 0, max: 1, step: 0.05 },
		}),
		Appearance: folder({
			wireframe: { value: false },
			textures: { value: true },
		}),
	});
	const { iterations, size, scale, levels, amplitude, wireframe, textures, k_g, k_s, k_r, reach } =
		state;
	const statePrev = useRef(state);

	const [seed, setSeed] = useState(0);
	const noise = useMemo(() => generateNoise(), [seed]);

	const flatShading = false;
	const color = 'darkgreen';

	useEffect(() => {
		let vertices: number[] = [];
		if (type === 'WAVE') waveSurface(vertices, size, amplitude, scale, 0.3);
		if (type === 'SIMPLEX') noiseTerrain(noise, vertices, size, amplitude, scale, levels);
		if (type === 'FDA') {
			const needsUpdate =
				statePrev.current.iterations === iterations &&
				statePrev.current.wireframe === wireframe &&
				statePrev.current.textures === textures;

			if (!getHistory(0) || needsUpdate) {
				forceDirectedTerrain(
					vertices,
					size,
					() => noiseTerrain(noise, vertices, size, amplitude, scale, levels),
					{ k_g, k_s, k_r, reach }
				);
			}
			vertices = getHistory(iterations);
			statePrev.current = state;
		}

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
	}, [state, noise]);

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
