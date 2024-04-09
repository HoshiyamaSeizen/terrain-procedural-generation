import { ThreeElements } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { BufferAttribute, DoubleSide, PlaneGeometry } from 'three';
import { waveSurface } from '../algorithms/WaveSurface';
import { simplexNoiseTerrain } from '../algorithms/SimplexNosie';
import SurfaceMaterial from '../materials/SurfaceMaterial';

type TerrainType = 'WAVE' | 'SIMPLEX';

const Surface = ({ type, ...props }: { type: TerrainType } & ThreeElements['mesh']) => {
	const ref = useRef<PlaneGeometry>(null!);
	const gridSize = 100;
	const stepSize = 1;
	const wireframe = false;
	const textures = true;
	const flatShading = false;
	const color = 'darkgreen';
	const amplitude = 2;

	const vertices: number[] = [];
	if (type === 'WAVE') waveSurface(vertices, gridSize, stepSize, amplitude, 0.3);
	if (type === 'SIMPLEX') simplexNoiseTerrain(vertices, gridSize, stepSize, amplitude);

	useEffect(() => {
		ref.current.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
		ref.current.computeVertexNormals();
	}, []);

	return (
		<mesh {...props}>
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
