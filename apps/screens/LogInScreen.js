import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TextInput,TouchableOpacity,KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as yup from 'yup';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 

import Screen from '../componentes/Screen'
import colors from '../config/colors';
import Icons from '../componentes/Icons';
import AppButton from '../componentes/AppButton';
import { Context } from '../config/context';
import url from '../config/url';


const schema = yup.object().shape({
    email: yup.string().email('Invalid email-ID').required('Email is required'),
    password: yup.string().required('Password is required'),
  });


function LogInScreen({navigation}) {

    const {login} = useContext(Context);
    const [userdata, setuserdata] = useState({
        email: "",
        password: ""
    }) ;
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [errormsg, seterrormsg] = useState(null);

    const handleSubmit = () =>{
        setIsLoading(true);
        //console.log(userdata);
        schema.validate(userdata, { abortEarly: false })
             .then((validatedData) => {
        // Data is valid
            console.log(validatedData);
            setValidationErrors({});


            fetch(`${url.localhost}/signin`,{
                method:'POST',
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify(validatedData)
            }).then(res => res.json()).then(
                data =>{
                    //console.log(data);
                    if (data.error) {
                            setIsLoading(false);
                            seterrormsg(data.error)
                        }
                        else{
                            setIsLoading(false);
                            alert(data.message);
                            navigation.navigate('Home');
                            login(data.token);
                            
                        }
                }
            )


           // navigation.navigate("Messages")
         })
            .catch((errors) => {
             // Data is invalid
             const errobj ={}
             errors.inner.forEach((error) => {
                errobj[error.path] = error.message;
              });
            setIsLoading(false);
            setValidationErrors(errobj);
  });
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
            <Image style={styles.image} source={require('../assets/login.png')}/>
            </View>
            <View style={styles.inputfeilds}>
            <Text style={styles.Signuptext}>Log In</Text>
            {errormsg && <Text style={{color:"red", paddingTop:15}}>{errormsg}</Text>}
            

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

            <View style={styles.textInputContainer2}>
            <MaterialIcons name="alternate-email" size={40} color = {colors.grey}/>
            <TextInput 
            placeholder="Email ID" 
            style={styles.textInput}
            keyboardType='email-address' 
            autoCapitalize='none' 
            autoCorrect={false} 
            onChangeText={(text)=>setuserdata({...userdata,email:text})}
            textContentType='emailAddress'/> 
            </View>
            {validationErrors.email&&<Text style={{color:"red",paddingTop:15}}>{validationErrors.email}</Text>}

            <View style={styles.textInputContainer2}>
            <Icons name="lock-outline" size={40} iconcolor = {colors.grey}/>
            <TextInput 
            placeholder="Enter your password" 
            secureTextEntry  
            style={styles.textInput}  
            autoCapitalize='none' 
            autoCorrect={false} 
            onChangeText={(text)=>setuserdata({...userdata,password:text})}
            textContentType='password'/> 
            </View>
            {validationErrors.password && <Text style={{color:"red", paddingTop:15}}>{validationErrors.password}</Text>}
            
            </KeyboardAvoidingView>
            <TouchableOpacity style ={styles.button} onPress={handleSubmit}>
            <Text style={styles.textinside}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.logintext}>New to Fancy Things? <Text style={styles.login} onPress={()=>navigation.navigate('Signup')}> Register</Text></Text>

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
        height:200,
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
export default LogInScreen;