import React, { useEffect, useState } from "react";
import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Router from "@routes/RouterRoot";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { ReminderProvider } from "@/src/context/ReminderContext";
import LayoutSidebar from "./src/components/LayoutSiderbar";

cssInterop(Ionicons, {
  className: {
    target: "style",
    nativeStyleToProp: {
      "color": "color"
    } as Record<string, string>
  }
})

const App = function () {
  const [isSplash, setIsSplash] = useState(true)

  useEffect(function () {
    setTimeout(() => setIsSplash(false), 5000)
  }, [])

  if (isSplash)
    return <Image
      source={require("@/assets/illustrations/splash.gif")}
      className="w-full h-full" />



  return (

    <ReminderProvider>

      <NavigationContainer>

        <GestureHandlerRootView>
          <StatusBar
            style='auto' />
          <LayoutSidebar>
            <Router
            />
          </LayoutSidebar>

        </GestureHandlerRootView>

      </NavigationContainer>

    </ReminderProvider>

  );
}
export default App
