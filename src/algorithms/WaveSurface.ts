export const waveSurface = (
	vertices: number[],
	size: number,
	amplitude = 0.2,
	scale = 1,
	frequency = 0.1
): void => {
	const calculateY = (x: number, z: number): number =>
		(Math.sin(x * frequency) * Math.cos(z * frequency) + 1) * amplitude;

	for (let x = -size / 2; x <= size / 2; x++) {
		for (let z = -size / 2; z <= size / 2; z++) {
			const [X, Z] = [x / size, z / size];
			const Y = calculateY(x, z);
			vertices.push(X * scale, Y, Z * scale);
		}
	}
};
