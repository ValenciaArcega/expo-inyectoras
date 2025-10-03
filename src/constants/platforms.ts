import {Platform} from "react-native"

export const OS_VERSION = parseInt(String(Platform.Version), 10)
export const IS_IOS = Platform.OS === "ios"
export const IS_ANDROID = Platform.OS === "android"
export const IS_WEB = Platform.OS === "web"
export const IS_LIQUID = IS_IOS && OS_VERSION >= 26
