
export const parseNumberToN2 = (quantity: number) => quantity
	.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const parseNumberToN0 = (quantity: number) => quantity
	.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const parseNumberToN3 = (quantity: number) => quantity
	.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });

export const isValidDecimalNumber = (value: string): boolean => {
	if (!value) return true;
	return /^-?\d+(\.\d+)?$/.test(value.trim());
};

export const MINUTES_IN_MS_10 = 9 * 60 * 1000;

