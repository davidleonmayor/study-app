import { CustomDrawer } from '@/presentation';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
    return (
        <Drawer
            screenOptions={{
                drawerActiveTintColor: "indigo",    // color del texto activo
                drawerInactiveTintColor: "#333",    // color del texto inactivo
                overlayColor: 'rgba(0,0,0,0.4)',
           
                headerShadowVisible: false,
                headerShown: false,
                drawerItemStyle: {
                    borderRadius: 3
                },
                sceneStyle: {
                    backgroundColor: "white"
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}
        />
    );
}
