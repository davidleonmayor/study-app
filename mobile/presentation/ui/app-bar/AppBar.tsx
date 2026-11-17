import React from 'react'
import { Image, View } from 'react-native'

export default function AppBar() {
    return (
        <View>
            <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 150, height: 32, paddingBottom:60 }}
                resizeMode='contain'
            />
        </View>
    )
}