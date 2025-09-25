import { useColorScheme } from "react-native";

export function useAppearance() {
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme == "dark" ? true : false;

	return {
		isDarkMode,
	};
}
