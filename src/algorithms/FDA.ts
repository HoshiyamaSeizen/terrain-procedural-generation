import { randVicinity } from './random';

// Algotithm constants
const BOTTOM = 0.01;
const ITERATION_COUNT = 10;
const FORCES = {
	GRAVITY: true,
	STRING: true,
	REPULSION: true,
};
const GRAVITY_CENTER = 0.0 + BOTTOM;

// Iteration history
const history: number[][] = [];
const clearHistory = () => history.splice(0, history.length);
export const getHistory = (iter: number) => history[iter];

// Model variables
const model = {
	k_g: 0,
	k_s: 0,
	k_r: 0,
	reach: 0,
	dist: (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) =>
		Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2),
	norm_y: (y1: number, y2: number, dist: number) => (y2 - y1) / dist,
};

// Forces functions
const force = {
	gravity: (d: number) => -d * model.k_g,
	repulsion: (d: number, n_y: number) => -randVicinity(model.k_r, model.k_r / 10) * d * d * n_y,
	string: (d: number, n_y: number) => randVicinity(model.k_s, model.k_s / 10) * d * n_y,
};

// Fisher-Yates shuffle algorithm
const shuffleOrder = (arr: number[]) => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

// Range function implementation
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Force directed algorithm
export const forceDirectedTerrain = (
	vertices: number[],
	size: number,
	initTerrainGenerator: (...args: never[]) => void,
	modelOpts: { k_g: number; k_s: number; k_r: number; reach: number }
): void => {
	clearHistory();
	initTerrainGenerator();

	Object.assign(model, modelOpts);

	const order = shuffleOrder(range(size * size));

	for (let _iter = 0; _iter <= ITERATION_COUNT; _iter++) {
		history.push(vertices.slice());

		for (const i of order) {
			const [x1, y1, z1] = vertices.slice(3 * i, 3 * i + 3);

			let gravityTotal = 0;
			let stringTotal = 0;
			let repulsionTotal = 0;

			// Gravity Force
			if (FORCES.GRAVITY) gravityTotal = force.gravity(y1 - GRAVITY_CENTER);

			const j1 = i % size;
			const i1 = (i - j1) / size;

			const iMin = Math.max(0, i1 - model.reach);
			const iMax = Math.min(size, i1 + model.reach + 1);
			const jMin = Math.max(0, j1 - model.reach);
			const jMax = Math.min(size, j1 + model.reach + 1);

			for (let i2 = iMin; i2 < iMax; i2++) {
				for (let j2 = jMin; j2 < jMax; j2++) {
					if (i2 === i1 && j2 === j1) continue;
					const index2 = i2 * size + j2;
					const [x2, y2, z2] = vertices.slice(3 * index2, 3 * index2 + 3);

					// if (y1 > y2) continue;
					const dist = model.dist(x1, y1, z1, x2, y2, z2);
					const norm_y = model.norm_y(y1, y2, dist);

					// String Force
					if (y1 < y2 && FORCES.STRING)
						stringTotal = Math.max(force.string(dist, norm_y), stringTotal);

					// Repulsion Force
					if (y1 > y2 && FORCES.REPULSION)
						repulsionTotal = Math.max(force.repulsion(dist, norm_y), repulsionTotal);
				}
			}

			vertices[3 * i + 1] = Math.max(y1 + gravityTotal + stringTotal + repulsionTotal, BOTTOM);
		}
	}
};
