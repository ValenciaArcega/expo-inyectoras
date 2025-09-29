import "./global.css";
import { GestureHandlerRootView} from "react-native-gesture-handler";
import Router from "@routes/RouterRoot";
import { NavigationContainer } from "@react-navigation/native";

const App = function(){
  return <GestureHandlerRootView>
    <NavigationContainer>
      <Router/>
    </NavigationContainer>
  </GestureHandlerRootView>
}
export default App
