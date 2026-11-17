
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export function CustomDrawer(props: DrawerContentComponentProps) {


    const logout = useAuthStore(state => state.logout);
    const name = useAuthStore(state => state.name);

    const router = useRouter();

    return (

        <DrawerContentScrollView
            {...props}
            scrollEnabled={false}
        >
            <View className='flex items-center w-full bg-primary p-5 mb-10'>



                <Text className='text-black font-work-black text-xl font-semibold'>Hola {name}</Text>

                <Image

                    style={{ width: 150, height: 100, resizeMode: 'contain' }}
                    source={require('@/assets/images/logo.png')}
                />

            </View>

            <View className='py-10'>

                <DrawerItem
                    labelStyle={{ fontSize: 18, fontWeight: '500' }}
                    style={{ marginBottom: 20 }}
                    label={'Configuración'}
                    icon={() => (
                        <FontAwesome name="gear" size={24} color="black" />
                    )}

                    onPress={() => {
                        router.push('/settings')
                        props.navigation.closeDrawer();
                    }}
                />
                <DrawerItem
                    labelStyle={{ fontSize: 18, fontWeight: '500' }}
                    icon={() => (
                        <MaterialIcons name="logout" size={24} color="black" />
                    )}
                    label="Cerrar sesión"
                    onPress={logout}

                />
            </View>

        </DrawerContentScrollView>
    )
}