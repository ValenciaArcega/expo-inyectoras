import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View, Text, ScrollView } from "react-native"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { gs } from "@/src/utils/styles";

const ControlCenter = () => {
    const go = useNavigation();
    return (

        <View 
        className="bg-[#99d8f3] dark:bg-[#000000]"
        style={{ flex: 1, padding: 12,}}
        >
            <ScrollView contentContainerStyle={gs.scroll}>
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}>
                    
                    <TouchableOpacity
                        onPress={() => go.navigate('Calendar')}
                        style={{
                            width: '49%',
                            aspectRatio: 1,
                            backgroundColor: '#0078D7',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical:'1%',
                            marginBottom: 12,
                            borderRadius: 8,
                        }}>
                        <Ionicons name="calendar" size={50} className="text-white dark:text-black" />
                        <Text style={{ color: '#fff' , fontSize: 18, fontWeight: 'bold' }}>
                            Calendario
                        </Text>
                        <Text style={{ fontSize: 14, textAlign: 'center', color: '#eee' }}>
                            Ver eventos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => go.navigate('Documents')}
                        style={{
                            width: '49%', 
                            aspectRatio: 1,
                            backgroundColor: '#FF8C00',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical:'1%',
                            marginBottom: 12,
                            borderRadius: 8,
                        }}>
                        <Ionicons name="documents" size={50} className="text-white dark:text-black" />
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                            Documentos
                        </Text>
                        <Text style={{ fontSize: 14, textAlign: 'center', color: '#eee' }}>
                            Inspeccionar
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => go.navigate('VR')}
                        style={{
                            width: '49%',
                            aspectRatio: 1,
                            backgroundColor: '#008f39',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical:'1%',
                            marginBottom: 12,
                            borderRadius: 8,
                        }}>
                        <MaterialCommunityIcons name="virtual-reality" size={60}  />
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                            Variables
                        </Text>
                        <Text style={{ fontSize: 14, textAlign: 'center', color: '#eee' }}>
                            Inspeccionar
                        </Text>

                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};


export default ControlCenter;
