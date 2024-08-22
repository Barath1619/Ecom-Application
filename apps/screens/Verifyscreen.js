import React, { useDebugValue, useEffect, useState } from 'react';
import { View,ScrollView, Text, StyleSheet,ActivityIndicator, Image, TextInput,TouchableOpacity,KeyboardAvoidingView, Platform } from 'react-native';
import * as yup from 'yup';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 

import Screen from '../componentes/Screen'
import colors from '../config/colors';
import Icons from '../componentes/Icons';
import AppButton from '../componentes/AppButton';
import url from '../config/url';


function Verifyscreen({navigation, route}) {

    const {userDetails, code} = route.params;
    const [otp, setotp] = useState("") ;
    const [err, seterr] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () =>{
        setIsLoading(true);
        if(!otp){
            setIsLoading(false);
            seterr("Please enter 6 digit verification code");
        }
        else if (otp!=code){
            setIsLoading(false);
            seterr("Incorrect one time password");
        }
        else{
            const newuser ={
                name:userDetails.name,
                email: userDetails.email,
                password: userDetails.password,
                zipcode: userDetails.zipcode,
            }
            fetch(`${url.localhost}/signup`,{
                method:'POST',
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify(newuser)
            }).then(res => res.json()).then(
                data =>{
                    if (data.error) {
                        setIsLoading(false);
                        alert(data.error);
                    }
                    else{
                        setIsLoading(false);
                        alert(data.message);
                        //console.log(data);
                        navigation.navigate('Login');
                        
                    }
                })
        }
            
    }
    return (
        <Screen>
            {isLoading && (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryblue} />
            </View>
             )}
            <ScrollView contentContainerStyle={styles.scrollview}>
            <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/otp.png')}/>
            </View>
            <View style={styles.inputfeilds}>
            <Text style={styles.Signuptext}>Verification</Text>
           

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

            
            <View style={styles.textInputContainer2}>
            <Icons name="lock-outline" size={40} iconcolor = {colors.grey}/>
            <TextInput 
            placeholder="Enter 6 digit One Time Password" 
            secureTextEntry  
            style={styles.textInput}  
            autoCapitalize='none' 
            keyboardType='number-pad'
            autoCorrect={false} 
            onChangeText={(text)=>setotp(text)}
            textContentType='oneTimeCode'/> 
            </View>
            {err && <Text style={{color:"red", paddingTop:15}}>{err}</Text>}
            
            </KeyboardAvoidingView>
            <TouchableOpacity style ={styles.button} onPress={handleSubmit}>
            <Text style={styles.textinside}>Verify</Text>
            </TouchableOpacity>

 
            </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      },
    image:{
        
        width:'100%',
        height:260,
        resizeMode:'contain',
        marginTop:40,
    },
    container:{
        alignItems:'center',
    },
    scrollview:{
        justifyContent:'center',
        
    },
    Signuptext:{
        fontSize:40,
        fontWeight:"600"
    },
    inputfeilds:{
        paddingLeft: 30
    },
    textInputContainer:{
        flexDirection:'row',
        marginTop:40,
        alignItems:'center'
    },
    textInputContainer2:{
        flexDirection:'row',
        paddingTop:30,
        alignItems:'center'
    },
    textInput:{
        flex:1,
        height:60,
        borderBottomColor:colors.grey,
        borderBottomWidth:2,
        marginHorizontal:30
    },
    button:{
        width :"90%",
        height: 55,
        borderRadius:10,
        marginVertical:10,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:colors.primaryblue,
        marginTop:60
    },
    textinside:{
        fontWeight:"500",
        fontSize:23,
        color:colors.white
    },
    logintext:{
        alignSelf:'center',
        color:colors.grey,
        marginVertical:25
    },
    login:{
        color:colors.primaryblue,
        paddingHorizontal:10,
        fontWeight:"bold"
    }
})
export default Verifyscreen;