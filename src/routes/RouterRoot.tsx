
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ControlCenter from '@core/ControlCenter';
import Calendar from '@core/Calendar';
import { View } from 'react-native';

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
		/>
		<Stack.Screen
			name='Dashboard'
			component={Dasboard}
		/>
		<Stack.Screen
			name='Variables'
			component={Variables}
		/>
	</Stack.Navigator>
}

const Andon = function () {
	return <Stack.Navigator>
		<Stack.Screen
			name='Andon'
			component={Andon}
			options={{
				headerShown: false,
			}}
		/>
	</Stack.Navigator>

}
const Dasboard = function () {
	return <Stack.Navigator>
		<Stack.Screen
			name='Dashboard'
			component={Dasboard}
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

const FileViewer = function () {
	return <Stack.Navigator>
		<Stack.Screen
			name='FileViewer'
			component={FileViewer}
			options={{
				headerShown: false,
			}}
		/>
	</Stack.Navigator>

}
export default Router
