import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { gs } from '@/src/utils/styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const Sidebar = function () {
  const go = useNavigation();
  return (
    <View style={styles.sidebar}
      className="!bg-[#e9ecef] dark:!bg-[#495057]">

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={gs.scroll}>

        <TouchableOpacity style={styles.iconButton}
          onPress={() => go.navigate('ControlCenter')}>
          <Ionicons name="home" size={24} className="text-black dark:text-white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}
          onPress={() => go.navigate('Board')}>
          <Ionicons name="tablet-portrait-sharp" size={24} className="text-black dark:text-white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}
          onPress={() => go.navigate('Calendar')}>
          <Ionicons name="calendar-outline" size={24} className="text-black dark:text-white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}
          onPress={() => go.navigate('FileViewer')}>
          <Ionicons name="documents" size={24} className="text-black dark:text-white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}
          onPress={() => go.navigate('Variables')}>
          <Ionicons name="construct" size={24} className="text-black dark:text-white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}
          onPress={() => go.navigate('Dashboard')}>
          <Ionicons name="bar-chart-sharp" size={24} className="text-black dark:text-white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}
          onPress={() => go.navigate('Andon')}>
          <Ionicons name="storefront-sharp" size={24} className="text-black dark:text-white" />
        </TouchableOpacity>










      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginVertical: 20,
  },
  activeButton: {
    backgroundColor: '#d0e8ff',
  },
});

export default Sidebar;
