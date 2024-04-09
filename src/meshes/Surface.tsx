import { ThreeElements } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { BufferAttribute, DoubleSide, PlaneGeometry } from 'three';
import { waveSurface } from '../algorithms/WaveSurface';
import { simplexNoiseTerrain } from '../algorithms/SimplexNosie';
import SurfaceMaterial from '../materials/SurfaceMaterial';

type TerrainType = 'WAVE' | 'SIMPLEX';

const Surface = ({ type, ...props }: { type: TerrainType } & ThreeElements['mesh']) => {
	const ref = useRef<PlaneGeometry>(null!);
	const gridSize = 50;
	const wireframe = false;
	const textures = true;
	const flatShading = false;
	const color = 'darkgreen';
	const amplitude = 0.2;
	const scale = 1;
	const levels = 8;

	const vertices: number[] = [];
	if (type === 'WAVE') waveSurface(vertices, gridSize, amplitude, scale, 0.3);
	if (type === 'SIMPLEX') simplexNoiseTerrain(vertices, gridSize, amplitude, scale, levels);

	useEffect(() => {
		ref.current.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
		ref.current.computeVertexNormals();
	}, []);

	return (
		<mesh {...props} scale={1 / scale}>
			<planeGeometry ref={ref} attach="geometry" args={[1, 1, gridSize, gridSize]} />
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
	);
};

export default Surface;
