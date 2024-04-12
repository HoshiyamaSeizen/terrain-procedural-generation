import { NoiseFunction2D, createNoise2D } from 'simplex-noise';

export const generateNoise = () => createNoise2D();

export const noiseTerrain = (
	noiseF: NoiseFunction2D,
	vertices: number[],
	size: number,
	amplitude = 0.2,
	scale = 1,
	levels = 1
): void => {
	const noise = (level: number, x: number, z: number): number =>
		noiseF(x * scale * level, z * scale * level) / level +
		(level > 1 ? noise(level / 2, x, z) : 0);
	const calculateY = (x: number, z: number) => (noise(2 ** levels, x, z) + 1.5) * amplitude + 0.1;

	for (let x = -size / 2; x < size / 2; x++) {
		for (let z = -size / 2; z < size / 2; z++) {
			const [X, Z] = [x / size, z / size];
			const Y = calculateY(X, Z);
			vertices.push(X * scale, Y, Z * scale);
		}
	}
};
