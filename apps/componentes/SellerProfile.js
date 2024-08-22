import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
//import Swipeable from 'react-native-gesture-handler/Swipeable';
import  {Swipeable,GestureHandlerRootView}  from 'react-native-gesture-handler';

import colors from '../config/colors';

function SellerProfile({title, subTitle, image, onPress, renderRightActions}) {

    
    return (
        <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
            
        <TouchableHighlight
        underlayColor={colors.lightgreen}
        onPress={onPress}>
        <View style={styles.container}>
            <Image source={image} style={styles.image}/>
            <View style={styles.titlecontainter}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subTitle}</Text>
            </View>

        </View>
        </TouchableHighlight>
  
        </Swipeable>
        </GestureHandlerRootView>
        
        
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        paddingHorizontal:18,
        padding:10,
        borderRadius:10,
        backgroundColor:colors.white,
        borderWidth:2,
        borderColor:colors.white

        

    },
    image:{
        width:85,
        height:85,
        resizeMode:"contain",
        borderRadius:60,
        borderWidth:2,
        marginRight:10,
        borderColor:colors.grey
    },
    titlecontainter:{
        justifyContent:"center",
        padding:5
    },
    title:{
        fontSize:20,
        fontWeight:"800"
    },
    subtitle:{
        fontWeight:"600",
        fontSize:15,
        color:colors.mediumgrey
    }
})

export default SellerProfile;