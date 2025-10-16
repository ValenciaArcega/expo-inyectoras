
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { View } from 'react-native';
import RouterUser from '../routes/RouterUser';

const LayoutSidebar = () => {
    return (
        <View className='flex-row'>
            <Sidebar />
            <View style={{ flex: 1, }}>
                <RouterUser />
            </View>
        </View>
    );
};

export default LayoutSidebar;
