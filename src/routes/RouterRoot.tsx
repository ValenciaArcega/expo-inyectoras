
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ControlCenter from '@core/ControlCenter';
import Calendar from '@core/Calendar';
import MyWebView from '../views/core/FileViewer';

const Stack = createNativeStackNavigator();

const Router = function () {
	return <Stack.Navigator>
		<Stack.Screen
			name='ControlCenter'
			component={ControlCenter}
		/>
		<Stack.Screen
			name='Calendar'
			component={Calendar}
		/>
		<Stack.Screen
			name='MyWebView'
			component={MyWebView}
		/>
	</Stack.Navigator>
}
export default Router