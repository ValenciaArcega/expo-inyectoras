import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Dimensions, ScrollView, TouchableOpacity, } from 'react-native';
import { Gesture, GestureDetector, } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, } from 'react-native-reanimated';
import { buttonsData } from '@/src/constants/control-center-btns';
import { gs } from '@/src/utils/styles';

const COLUMNS = 3;
const SPACING = 12;
const SCREEN_WIDHT = Dimensions.get('window').width;
const BUTTON_SIZE = (SCREEN_WIDHT - (COLUMNS - 1) * SPACING - 24) / COLUMNS;
const BUTTON_HEIGHT = Dimensions.get('screen').height / 4;

const DraggableButton = ({ btn, index, positions }) => {
    const go = useNavigation()
    const offset = useSharedValue({ x: 0, y: 0 });
    const start = useSharedValue({ x: 0, y: 0 });

    const handlePress = () => {
        try {
            if (btn.route) {
                go.navigate(btn.route);
            }
        } catch (err) {
            console.warn("Error during navigation:", err);
        }
    };


    const gesture = Gesture.Pan()
        .onBegin(() => {
            start.value = { ...offset.value };
        })

        .onUpdate((e) => {
            offset.value = { x: e.translationX, y: e.translationY };
        })

        .onEnd(() => {
            const TAP_SENSITIVITY = 5;

            const moved =
                Math.abs(offset.value.x - start.value.x) > TAP_SENSITIVITY ||
                Math.abs(offset.value.y - start.value.y) > TAP_SENSITIVITY;


            if (!moved && btn.route) {

                runOnJS(handlePress)();
                return;
            }
            const finalX = positions[index].value.x + offset.value.x;
            const finalY = positions[index].value.y + offset.value.y;

            let closestIndex = -1;
            let minDist = Infinity;
            +
                positions.forEach((pos, i) => {
                    if (i !== index) {
                        const dist = Math.hypot(finalX - pos.value.x, finalY - pos.value.y);
                        if (dist < minDist) {
                            minDist = dist;
                            closestIndex = i;
                        }
                    }
                });

            if (minDist < BUTTON_SIZE / 2) {
                const temp = { ...positions[index].value };
                positions[index].value = withSpring(positions[closestIndex].value);
                positions[closestIndex].value = withSpring(temp);
            } else {
                positions[index].value = withSpring(positions[index].value);
            }

            offset.value = { x: 0, y: 0 };
        });



    const style = useAnimatedStyle(() => ({
        position: "absolute",
         width: BUTTON_SIZE,
        height:BUTTON_HEIGHT,
        borderRadius: 18,
        shadowColor: 'rgba(0,0,0,0.9)',
        shadowOffset: {
            height: 8, width: 0
        },
        shadowRadius: 6,
        backgroundColor: btn.color,
        justifyContent: "center",
        alignItems: "center",
        transform: [
            { translateX: positions[index].value.x + offset.value.x },
            { translateY: positions[index].value.y + offset.value.y },
        ],
    }));


    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={style}>
                 <TouchableOpacity
          onPress={handlePress}
          className="px-6 py-7 !bg-white dark:!bg-[#495057] rounded-2xl items-center justify-center w-full h-full"
        >
          <Ionicons name={btn.icon} size={48} className={btn.iconColor} />
          <Text className="text-black dark:text-white font-bold text-lg mt-2">
            {btn.title}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            {btn.subtitle}
          </Text>
        </TouchableOpacity>

            </Animated.View>
        </GestureDetector>
    );
};

const ControlCenter = () => {
    const go = useNavigation();
    // Posiciones intercambiadas
    const positions = buttonsData.map((_, i) =>
        useSharedValue({
            x: (i % COLUMNS) * (BUTTON_SIZE + SPACING),
            y: Math.floor(i / COLUMNS) * (BUTTON_SIZE + SPACING),
        })
    );

    return (
          <View className="bg-[#f2f2f7] dark:bg-[#343a40] flex-1">
      <ScrollView contentContainerStyle={gs.scroll}>
        <View style={{ padding: 16, minHeight: '100%' }}>

          {buttonsData.map((btn, i) => (
            <DraggableButton
              key={btn.id}
              btn={btn}
              index={i}
              positions={positions}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


export default ControlCenter;  