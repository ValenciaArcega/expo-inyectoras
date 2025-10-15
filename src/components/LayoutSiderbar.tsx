
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { View } from 'react-native';


type Props = {
    children: ReactNode;
};

const LayoutSidebar = ({ children }: Props) => {
    return (
        <View className='flex-row '>
            <Sidebar />
            <View style={{ flex: 1, }}>{children}

            </View>
        </View>
    );
};

export default LayoutSidebar;
