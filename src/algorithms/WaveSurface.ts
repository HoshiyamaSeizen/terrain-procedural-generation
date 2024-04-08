export const waveSurface = (
	vertices: number[],
	gridSize: number,
	stepSize = 1,
	amplitude = 10,
	frequency = 0.1
): void => {
	const calculateY = (x: number, z: number): number =>
		(Math.sin(x * frequency) * Math.cos(z * frequency) + 1) * amplitude;

	for (let x = -gridSize / 2; x <= gridSize / 2; x += stepSize) {
		for (let z = -gridSize / 2; z <= gridSize / 2; z += stepSize) {
			const y = calculateY(x, z);
			vertices.push(x, y, z);
		}
	}
};
