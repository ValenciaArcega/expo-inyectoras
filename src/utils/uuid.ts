
export const createUUID = (): string =>
	Math.random().toString(36).slice(2, 12);
