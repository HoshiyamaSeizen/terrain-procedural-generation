import React from 'react';
import { Canvas } from '@react-three/fiber';
import Surface from '../meshes/Surface';
import { OrbitControls, Stats } from '@react-three/drei';
import Environment from '../Environment';

const Screen = () => {
	return (
		<div className="canvas-container">
			<Canvas camera={{ position: [0.7, 1.3, 0.7] }}>
				<Environment />
				<Surface type="FDA" position={[0, 0, 0]} />
				<OrbitControls target={[0, 0.3, 0]} />
				<Stats className="stats" />
			</Canvas>
		</div>
	);
};

export default Screen;
