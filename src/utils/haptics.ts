import * as Haptics from "expo-haptics";

type VibrationIntensity = "heavy" | "light" | "medium" | "rigid" | "soft";
/**
 * Trigges a the device haptic vibration based on the provided type.
 * @param type - The type of vibration style to trigger.
 */
export function hapticFeedback(type: VibrationIntensity) {
	const feedbackMap = {
		heavy: Haptics.ImpactFeedbackStyle.Heavy,
		light: Haptics.ImpactFeedbackStyle.Light,
		medium: Haptics.ImpactFeedbackStyle.Medium,
		rigid: Haptics.ImpactFeedbackStyle.Rigid,
		soft: Haptics.ImpactFeedbackStyle.Soft,
	};
	const feedbackType = feedbackMap[type];

	if (feedbackType) Haptics.impactAsync(feedbackType);
}
