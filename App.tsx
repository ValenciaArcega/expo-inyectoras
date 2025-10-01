import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Router from "@routes/RouterRoot";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: {
    target: "style",
    nativeStyleToProp: {
      "color": "color"
    } as Record<string, string>
  }
})


const App = function () {
  return <GestureHandlerRootView>
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  </GestureHandlerRootView>

}
export default App
