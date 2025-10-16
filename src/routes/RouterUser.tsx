import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { View } from "react-native"
import ControlCenter from '@core/ControlCenter';
import Calendar from '@core/Calendar';
import MyWebView from '../views/core/FileViewer';
import Andon from '../views/core/Andon';
import Dashboard from '../views/core/Dashboard';
import Variables from '../views/core/Variables';
import Board from '../views/core/Board';
import Notification from "../views/core/Notification";
const Stack = createNativeStackNavigator();

const RouterUser = function () {
    return <View className='w-full h-full'>
        <Stack.Navigator>
            <Stack.Screen
                name='ControlCenter'
                component={ControlCenter}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Calendar'
                component={Calendar}
                options={{
                    headerShown: false,
                }}

            />
            <Stack.Screen
                name='Andon'
                component={Andon}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Dashboard'
                component={Dashboard}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Variables'
                component={Variables}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='FileViewer'
                component={MyWebView}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='Board'
                component={Board}
                options={{
                    headerShown: false,
                }}
            />
                        <Stack.Screen
                name='Notificacion'
                component={Notification}
                options={{
                    headerShown: false,
                }}
            />

        </Stack.Navigator>
    </View>
}

export default RouterUser;
