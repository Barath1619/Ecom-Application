import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View } from 'react-native';
import  Swipeable  from 'react-native-gesture-handler/Swipeable';

import colors from '../config/colors';

function AppButton({title,color="primary",textcolor='white', onPress}) {
    return (
        
        <TouchableOpacity style ={[styles.button,{backgroundColor:colors[color]}]} onPress={onPress}>
            <Text style={[styles.textinside, {color:colors[textcolor]}] }>{title}</Text>
        </TouchableOpacity>
       
    );
}

const styles = StyleSheet.create({
    button:{
        width :"90%",
        height: 55,
        borderRadius:10,
        marginVertical:10,
        justifyContent:"center",
        alignItems:"center",
    },
    textinside:{
        fontWeight:"900",
        fontSize:23,

    }
})
export default AppButton;