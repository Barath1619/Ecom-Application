import React from 'react';
import { View,StyleSheet } from 'react-native';
import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons"

import colors from '../config/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

function SellerProfileDeleteAction({onPress}) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>

        <View >
            <Ionicons name='ios-trash-sharp' size={30} color={colors.red} />
        </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:80,
        marginVertical:5,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center"
    }
})

export default SellerProfileDeleteAction;