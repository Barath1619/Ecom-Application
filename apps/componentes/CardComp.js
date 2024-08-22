import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 

import colors from '../config/colors';

function CardComp({title, zip, price, onPress, imageuri, date}) {

    //console.log(imageuri)
    

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}> 
            <Image style={styles.image} source={imageuri[0]!=null?{ uri:`data:image/jpeg;base64,${imageuri[0]}` }:require('../assets/noimg.png')}/>
            <View style={{flex:1,flexDirection:"row"}}>
            <View style={styles.textcontainer}>
                <Text style={styles.textTitle}>{title}</Text>
                <Text style={styles.textPrice}>${price}</Text>
            </View>
            <View style={{justifyContent:"center", alignItems:'center'}}>
                <View style={styles.textcontainer2}>
                <Text style={styles.textZip}>{zip}</Text>
                <Entypo name="location-pin" size={30} color={colors.grey} />
                </View>
                <Text style={{paddingTop:5}}>{date}</Text>
            
            </View>
            
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container:{
        width:"95%",
        height:290,
        marginVertical:6,
        alignSelf:"center",
        borderRadius:15,
        overflow:"hidden",
        //borderWidth:2,
        elevation:5,
        shadowColor:colors.black,
        shadowOffset:{width:1,height:2},
        shadowOpacity:.5,
        shadowRadius:2,
        backgroundColor:colors.white
        
    },
    image:{
        width:"100%",
        height:200,
        
    },
    textTitle:{
        fontSize:20,
        fontWeight:"400"
    },
    textPrice:{
         fontSize:18,
         color:colors.green,
         fontWeight:"900"
    },
    textcontainer:{
        padding:20,
        flex:1,
        justifyContent:"center"
    },
    textcontainer2:{
        flexDirection:"row-reverse",
        //justifyContent:"center",
        paddingLeft:20,
        paddingRight:3,
        alignItems:"center",
    },
    textZip:{
        fontSize:15,
        fontWeight:"600",
        color:colors.grey

    }
    
})

export default CardComp;