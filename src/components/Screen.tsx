import React from 'react';
import { Canvas } from '@react-three/fiber';
import Box from '../meshes/Box';

const Screen = () => {
	return (
		<div className="canvas-container">
			<Canvas>
				<ambientLight intensity={Math.PI / 2} />
				<spotLight
					position={[10, 10, 10]}
					angle={0.15}
					penumbra={1}
					decay={0}
					intensity={Math.PI}
				/>
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<Box position={[-1.2, 0, 0]} />
				<Box position={[1.2, 0, 0]} />
			</Canvas>
		</div>
	);
};

export default Screen;
