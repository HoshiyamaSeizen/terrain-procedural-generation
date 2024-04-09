import React from 'react';
import { Canvas } from '@react-three/fiber';
import Surface from '../meshes/Surface';
import { OrbitControls, Stats } from '@react-three/drei';
import Environment from '../Environment';

const Screen = () => {
	return (
		<div className="canvas-container">
			<Canvas camera={{ position: [0.6, 0.6, 0.6] }}>
				<Environment />
				<Surface type="SIMPLEX" position={[0, 0, 0]} />
				<OrbitControls target={[0, 0, 0]} />
				<Stats className="stats" />
			</Canvas>
		</div>
	);
};

export default Screen;
