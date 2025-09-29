import { useNavigation } from "@react-navigation/native";
import { Button, TouchableOpacity, View } from "react-native"

const ControlCenter = function () {
    const go = useNavigation()
    return <View>
        <Button title="Navegar al Calendario" onPress={function () { 
            go.navigate('Calendar') 
        }}>
        </Button>
    </View>
}
export default ControlCenter;
