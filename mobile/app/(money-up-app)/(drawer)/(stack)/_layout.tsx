import AppBar from '@/presentation/ui/app-bar/AppBar';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation, useRouter } from 'expo-router';


export default function StackLayout() {

    const router = useRouter();

    const navigation = useNavigation();

    const onHeaderLeftClick = (canGoBack: boolean | undefined) => {
        if (canGoBack) {
            //No sirve..
            // navigation.dispatch(StackActions.pop());
            router.back();
            return;
        }

        navigation.dispatch(DrawerActions.toggleDrawer);
    };

    return (
        <Stack

            screenOptions={{

                headerTitle: () => <AppBar />,
                // headerShown: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontSize: 25,
                    fontWeight: '700',
                    color: 'black'
                },
                headerStyle: {
                    backgroundColor: '#A3E635'
                },
                headerShadowVisible: false,
                contentStyle: {
                    backgroundColor: 'white',
                },
                headerLeft: ({ canGoBack }) => (
                    <Ionicons
                        name={canGoBack ? 'arrow-back' : 'menu-outline'}
                        className="mr-5"
                        color="black"
                        size={40}
                        onPress={() => onHeaderLeftClick(canGoBack)}
                    />
                ),
            }}
        >
         <Stack.Screen
            name="/(tabs)/(budgets)"
         />
       
         <Stack.Screen
            name="/config"
         />

         <Stack.Screen
            name='create-budget-form'
         />

         <Stack.Screen
            name='subjects'
            options={{
                title: 'Subjects',
            }}
         />
       
        </Stack>

    );
}
