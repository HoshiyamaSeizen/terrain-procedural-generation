export const normalDist = (mean: number, standardDeviation: number) => {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return z * standardDeviation + mean;
};

export const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const randVicinity = (value: number, diff: number) => random(value - diff, value + diff);
