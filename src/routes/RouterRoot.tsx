
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ControlPanel from '@core/ControlPanel';

const Stack = createNativeStackNavigator();

const RouterRoot = function () {
	return <Stack.Navigator>
		<Stack.Screen
			name='ControlPanel'
			component={ControlPanel}
		/>
	</Stack.Navigator>;
};

export default RouterRoot;
