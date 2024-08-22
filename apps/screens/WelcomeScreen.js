import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import colors from '../config/colors';

import AppButton from '../componentes/AppButton';


function WelcomeScreen({navigation}) {
    return (
        
        <ImageBackground style={styles.container} source={require("../assets/furniture.jpg")} blurRadius={8}>
            <View style={styles.logoview}>
            <Image style={styles.logo} source={require("../assets/logo.png")} />
            <Text style={styles.logoname}>Just sell it !!!</Text>
            </View>
            <AppButton title="Signup" color="primaryblue" onPress={()=>navigation.navigate('Signup')}/>
            <AppButton title="Login" textcolor='primaryblue' color="white" onPress={()=>navigation.navigate('Login')}/>
        </ImageBackground>
         
        
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
        alignItems: "center",
        justifyContent: "flex-end"
        
    },
    logoview:{
        width:"80%",
        position:"absolute",
        top:100,
        alignItems:"center"
        
    },
    logoname:{
        zIndex:1,
        position:"absolute",
        top:190,
        fontWeight:"bold"
    },
    logo:{
        width:300,
        height:300,
    },
    button:{
        width :"90%",
        height: 80,
        backgroundColor: colors.primary,
        borderRadius:10,
        marginVertical:10

    },
    button2:{
        width :"90%",
        height: 80,
        backgroundColor: colors.secondary,
        borderRadius:10,
        marginVertical:10

    }
});
export default WelcomeScreen;