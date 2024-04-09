import { createNoise2D } from 'simplex-noise';

export const simplexNoiseTerrain = (
	vertices: number[],
	size: number,
	amplitude = 0.2,
	scale = 1,
	levels = 1
): void => {
	const simplex = createNoise2D();
	const noise = (level: number, x: number, z: number): number =>
		simplex(x * scale * level, z * scale * level) / level +
		(level > 1 ? noise(level / 2, x, z) : 0);
	const calculateY = (x: number, z: number) => noise(2 ** levels, x, z) * amplitude;

	for (let x = -size / 2; x <= size / 2; x++) {
		for (let z = -size / 2; z <= size / 2; z++) {
			const [X, Z] = [x / size, z / size];
			const Y = calculateY(X, Z);
			vertices.push(X * scale, Y, Z * scale);
		}
	}
};
