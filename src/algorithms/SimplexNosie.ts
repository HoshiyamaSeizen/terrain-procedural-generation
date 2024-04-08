import { createNoise2D } from 'simplex-noise';

export const simplexNoiseTerrain = (
	vertices: number[],
	gridSize: number,
	stepSize: number,
	amplitude: number
): void => {
	const noise = createNoise2D();
	const calculateY = (x: number, z: number) => (noise(x, z) + 1) * amplitude;

	for (let x = -gridSize / 2; x <= gridSize / 2; x += stepSize) {
		for (let z = -gridSize / 2; z <= gridSize / 2; z += stepSize) {
			const y = calculateY(x / stepSize, z / stepSize);
			vertices.push(x, y, z);
		}
	}
};
