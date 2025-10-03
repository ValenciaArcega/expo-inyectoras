import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector, } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, } from 'react-native-reanimated';

const COLUMNS = 3;
const SPACING = 12;
const SCREEN_WIDHT = Dimensions.get('window').width;
const BUTTON_SIZE = (SCREEN_WIDHT - (COLUMNS - 1) * SPACING - 24) / COLUMNS;


const buttonsData = [ //array para datos de botones
    { id: 1, title: "ANDON", subtitle: "Inspeccionar", icon: "storefront-sharp", color: "#FF8C00" },
    { id: 2, title: "CRONOGRAMA", subtitle: "Ver eventos", icon: "calendar", color: "#0078D7", route: 'Calendar' },
    { id: 3, title: "DASHBOARD", subtitle: "Analizar", icon: "bar-chart-sharp", color: "#6576b4" },
    { id: 4, title: "VARIABLES", subtitle: "Inspeccionar", icon: "construct", color: "#dc143c" },
    { id: 5, title: "VISOR", subtitle: "Analizar", icon: "documents", color: "#008080" },
];


const DraggableButton = ({ btn, index, positions }) => {
    const go = useNavigation()
    const offset = useSharedValue({ x: 0, y: 0 });

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            offset.value = { x: e.translationX, y: e.translationY };
        })
        .onEnd(() => {
            const finalX = positions[index].value.x + offset.value.x;
            const finalY = positions[index].value.y + offset.value.y;

            let closestIndex = -1;
            let minDist = Infinity;

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
        height: BUTTON_SIZE,
        borderRadius: 8,
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
                <Ionicons name={btn.icon} size={50} className="text-white dark:text-black" />
                <Text  onPress={() => {
                        if (btn.id === 2) go.navigate('Calendar')
                    }} style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                    {btn.title}
                </Text>
                <Text style={{ color: "white", fontSize: 12, textAlign: "center" }}>
                    {btn.subtitle}
                </Text>
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
        <View className="bg-[#99d8f3] dark:bg-[#303650]"
            style={{ flex: 1, padding: 12 }}>
            <ScrollView contentContainerStyle={{ minHeight: "195%" }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
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