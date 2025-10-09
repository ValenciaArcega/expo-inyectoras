
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ControlCenter from '@core/ControlCenter';
import Calendar from '@core/Calendar';
import { View } from 'react-native';
import MyWebView from '../views/core/FileViewer';
import Andon from '../views/core/Andon';
import Dashboard from '../views/core/Dashboard';

const Stack = createNativeStackNavigator();

const Router = function () {
	return <Stack.Navigator>
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

	</Stack.Navigator>
}

const Variables = function () {
	return <Stack.Navigator>
		<Stack.Screen
			name='Variables'
			component={Variables}
			options={{
				headerShown: false,
			}}
		/>
	</Stack.Navigator>
}

export default Router
