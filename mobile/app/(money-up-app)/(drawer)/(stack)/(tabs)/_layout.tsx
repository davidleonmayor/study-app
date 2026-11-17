import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Tabs } from "expo-router";

// 💡 Este archivo define el layout principal para las pestañas (Tabs)
// dentro de la app. Expo Router usa la carpeta (tabs) para generar automáticamente
// una navegación por pestañas (bottom tab navigation).

export default function TabsLayout() {



    //Acciona una pequeña vibración al presionar cada tab, esto ofrece retroalimentación al usuario
    const shootVibration = () => {
        console.log('Vibration triggered')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }

    return (

        // <Tabs> crea un "Tab Navigator" automáticamente.
        // Cada archivo dentro de la carpeta (tabs) será una pestaña.
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#7AAC28",
            animation: "shift",
            tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: "600"
            },
            tabBarStyle: {
                position: "absolute",
                
                elevation: 0,
                shadowOpacity: 0,

                backgroundColor: "#FFFFFF",

            }

        }}>


            <Tabs.Screen
                name="budgets/index"
                options={{
                    title: "Presupuesto",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="piggy-bank" size={size} color={color} />
                    )
                }}
                listeners={{
                    tabPress: shootVibration
                }}
            />

            <Tabs.Screen
                name="profile/profile"
                options={{
                    title: "Mi perfil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={24} color={color} />
                    )
                }}
                listeners={{
                    tabPress: shootVibration
                }}
            />

        </Tabs>

    );
}
