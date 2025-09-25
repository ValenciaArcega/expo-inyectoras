import "./global.css";
import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const BOX_W = 200; // w-64
const BOX_H = 128; // h-32
const GAP = 12;    // gap-3
export default function App() {

  // posiciones iniciales (2 columnas por ejemplo)
  const positions = useSharedValue([
    { x: 0, y: 0 },
    { x: BOX_W + GAP, y: 0 },
    { x: 0, y: BOX_H + GAP },
    { x: BOX_W + GAP, y: BOX_H + GAP },
    { x: 0, y: (BOX_H + GAP) * 2 },
  ]);

  // para cada caja guardamos su offset animado
  const offsets = positions.value.map((pos) => ({
    x: useSharedValue(pos.x),
    y: useSharedValue(pos.y),
  }));

  const swap = (i, j) => {
    const newPositions = [...positions.value];
    const tmp = newPositions[i];
    newPositions[i] = newPositions[j];
    newPositions[j] = tmp;
    positions.value = newPositions;

    // animamos cada offset a su nueva posición
    offsets.forEach((o, idx) => {
      o.x.value = withSpring(newPositions[idx].x);
      o.y.value = withSpring(newPositions[idx].y);
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 mt-24 ml-20">
        {positions.value.map((_, index) => {
          const offsetX = offsets[index].x;
          const offsetY = offsets[index].y;

          const gesture = Gesture.Pan()
            .onUpdate((e) => {
              offsetX.value = positions.value[index].x + e.translationX;
              offsetY.value = positions.value[index].y + e.translationY;
            })
            .onEnd(() => {
              const targetIndex = positions.value.findIndex((pos, i) => {
                if (i === index) return false;
                return (
                  Math.abs(offsetX.value - pos.x) < BOX_W / 2 &&
                  Math.abs(offsetY.value - pos.y) < BOX_H / 2
                );
              });

              if (targetIndex !== -1) {
                runOnJS(swap)(index, targetIndex);
              } else {
                offsetX.value = withSpring(positions.value[index].x);
                offsetY.value = withSpring(positions.value[index].y);
              }
            });

          const style = useAnimatedStyle(() => ({
            position: "absolute",
            width: BOX_W,
            height: BOX_H,
            borderRadius: 16,
            backgroundColor: "#737373",
            transform: [
              { translateX: offsetX.value },
              { translateY: offsetY.value },
            ],
          }));

          return (
            <GestureDetector key={index} gesture={gesture}>
              <Animated.View style={style} />
            </GestureDetector>
          );
        })}
      </View>
    </GestureHandlerRootView>
  );
}
