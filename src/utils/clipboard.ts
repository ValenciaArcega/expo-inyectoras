import * as Clipboard from 'expo-clipboard';

export async function saveToClipboard(textToCopy: string) {
	await Clipboard.setStringAsync(textToCopy);
};

export async function getClipboard(): Promise<string> {
	const text: string = await Clipboard.getStringAsync();

	return text;
};
