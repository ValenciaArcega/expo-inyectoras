import { Platform } from "react-native";

export const IS_IOS = Platform.OS == "ios";
export const IS_ANDROID = Platform.OS == "android";
export const IS_MACOS = Platform.OS === "macos";
export const IS_WINDOWS = Platform.OS === "windows";
export const IS_WEB = Platform.OS === "web";

export const fontFamilyMono = IS_IOS ? 'Courier New' : 'monospace';

export const SO_VERSION = parseInt(String(Platform.Version), 10);

export const IS_LIQUID = IS_IOS && SO_VERSION >= 26;
