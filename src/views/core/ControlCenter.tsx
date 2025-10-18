import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Dimensions, ScrollView, TouchableOpacity, Modal, } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, } from 'react-native-reanimated';
import { buttonsData } from '@/src/constants/control-center-btns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gs } from '@/src/utils/styles';
import { DraggableButtonProps } from '@/src/types/elements';

// import { buttonsData } from "@/src/constants/control-center-btns";
// import { useFlow } from "@/src/hooks/useFlow";
// import { gs } from "@/src/utils/styles";
// import { Ionicons } from "@expo/vector-icons";
// import { ScrollView, Text, TouchableOpacity, View } from "react-native";


const COLUMNS = 3;
const SPACING = 12;
const PADDING_HORIZONTAL = 12;
const EXTRA_TOP_MARGIN = 20;


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BUTTON_WIDTH =
    (SCREEN_WIDTH - (COLUMNS - 1) * SPACING - PADDING_HORIZONTAL * 2) / COLUMNS;



const DraggableButton = ({ btn, index, positions, buttonHeight, }: DraggableButtonProps) => {
    const go = useNavigation();
    const offset = useSharedValue({ x: 0, y: 0 });
    const start = useSharedValue({ x: 0, y: 0 });

    const handlePress = () => {
        try {
            // @ts-ignoreignore-ts
            go.navigate("LayoutSidebar", {
                screen: btn.route
            });
            // @ts-ignoreignore-ts
            if (btn.id === 5) go.navigate('FileViewer');

            // setIsVisible(false)
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
            const TAP_SENSITIVITY = 2;
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

            positions.forEach((pos: any, i: number) => {
                if (i !== index) {
                    const dist = Math.hypot(
                        finalX - pos.value.x,
                        finalY - pos.value.y
                    );
                    if (dist < minDist) {
                        minDist = dist;
                        closestIndex = i;
                    }
                }
            });

            if (minDist < BUTTON_WIDTH / 2) {
                const temp = { ...positions[index].value };
                positions[index].value = withSpring(positions[closestIndex].value);
                positions[closestIndex].value = withSpring(temp);
            } else {
                positions[index].value = withSpring(positions[index].value);
            }

            offset.value = { x: 0, y: 0 };
        });

    const style = useAnimatedStyle(() => ({
        position: 'absolute',
        width: BUTTON_WIDTH,
        height: buttonHeight,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
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
    const insets = useSafeAreaInsets();
    const go = useNavigation();

    const ROWS = Math.ceil(buttonsData.length / COLUMNS);
    const verticalSpacing = (ROWS - 1) * SPACING;
    const usableHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
    const BUTTON_HEIGHT = (usableHeight - verticalSpacing - 32) / ROWS;

    const positions = buttonsData.map((_, i) =>
        useSharedValue({
            x: (i % COLUMNS) * (BUTTON_WIDTH + SPACING),
            y: insets.top + EXTRA_TOP_MARGIN + Math.floor(i / COLUMNS) * (BUTTON_HEIGHT + SPACING),


        })
    );

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        setCurrentDate(new Date());
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (

        <View
            className="bg-[#f2f2f7] dark:bg-[#343a40] flex-1 "
            style={{ paddingHorizontal: PADDING_HORIZONTAL }}
        >
            <View className="w-full flex-row justify-between items-center">
                {/* Campana al inicio */}
                <TouchableOpacity onPress={() => go.navigate('Notification')}>
                    <Ionicons name="notifications-outline" size={30} className="text-red-700" />
                </TouchableOpacity>

                {/* Hora y fecha al final */}
                <View className="flex-row items-center space-x-2">
                    <Text className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        {currentDate.toLocaleTimeString()}
                    </Text>
                    <Text className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        {currentDate.toLocaleDateString()}
                    </Text>
                </View>
            </View>

            {/* <TouchableOpacity
                // onPress={() => go.navigate('Notification')}
            >
                <Ionicons name="notifications-outline" size={30} className='text-red-700' />
            </TouchableOpacity> */}

            <ScrollView contentContainerStyle={gs.scroll}>

                <View style={{ flex: 1, minHeight: SCREEN_HEIGHT }}>
                    {buttonsData.map((btn, i) => (
                        <DraggableButton
                            key={btn.id}
                            btn={btn}
                            index={i}
                            positions={positions}
                            buttonHeight={BUTTON_HEIGHT}

                        />
                    ))}
                </View>
            </ScrollView>
        </View>


    );
};
export default ControlCenter;

// const ControlCenter = function () {
//     const { go } = useFlow();

//     return <View className="bg-[#f2f2f7] dark:bg-[#343a40] flex-1 ">
//         <View className="w-full flex-row justify-between items-center">
//             {/* Campana al inicio */}
//             <TouchableOpacity onPress={() => go.navigate('Notification')}>
//                 <Ionicons name="notifications-outline" size={30} className="text-red-700" />
//             </TouchableOpacity>

//             {/* Hora y fecha al final */}
//             {/* <View className="flex-row items-center space-x-2">
//                 <Text className="text-2xl font-bold tracking-tight text-black dark:text-white">
//                     {currentDate.toLocaleTimeString()}
//                 </Text>
//                 <Text className="text-2xl font-bold tracking-tight text-black dark:text-white">
//                     {currentDate.toLocaleDateString()}
//                 </Text>
//             </View> */}
//         </View>

//         {/* <TouchableOpacity
//                 // onPress={() => go.navigate('Notification')}
//             >
//                 <Ionicons name="notifications-outline" size={30} className='text-red-700' />
//             </TouchableOpacity> */}

//         <ScrollView contentContainerStyle={gs.scroll}>
//             <View className="flex-row gap-12 flex-wrap justify-between">
//                 {buttonsData.map((btn, i) => (<TouchableOpacity
//                     onPress={() => go.navigate('LayoutSidebar', {
//                         screen: btn.route
//                     })}
//                     className=" !bg-white dark:!bg-[#495057] rounded-2xl items-center justify-center w-[23%] p-2"
//                 >
//                     <Ionicons name={btn.icon} size={48} className={btn.iconColor} />
//                     <Text className="text-black dark:text-white font-bold text-lg mt-2">
//                         {btn.title}
//                     </Text>
//                     <Text className="text-gray-600 dark:text-gray-400 text-center">
//                         {btn.subtitle}
//                     </Text>
//                 </TouchableOpacity>
//                 ))}
//             </View>
//         </ScrollView>
//     </View>
// }

// export default ControlCenter;
