
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ControlCenter from '@core/ControlCenter';
import LayoutSidebar from '@components/LayoutSiderbar';
import Notification from '../views/core/Notification';
import { ReminderProvider } from '../context/ReminderContext';

const Stack = createNativeStackNavigator();

const RouterRoot = function () {
	return <ReminderProvider>
		<Stack.Navigator
		screenOptions={{
			headerShown: false,
		}}
		initialRouteName='ControlCenter'>
		<Stack.Screen
			name='ControlCenter'
			component={ControlCenter}
		/>
		<Stack.Screen
			name='LayoutSidebar'
			component={LayoutSidebar}
		/>
		<Stack.Screen
			name='Notificacion'
			component={Notification}
			options={{
				headerShown: false,
			}}
		/>
	</Stack.Navigator>
</ReminderProvider>
}

export default RouterRoot
