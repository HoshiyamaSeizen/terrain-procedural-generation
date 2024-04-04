import { Sky } from '@react-three/drei';
import React from 'react';

const Environment = () => {
	return (
		<>
			<ambientLight intensity={Math.PI / 2} />
			<pointLight position={[10, 10, -10]} decay={0} intensity={Math.PI} />
			<Sky />
		</>
	);
};

export default Environment;
