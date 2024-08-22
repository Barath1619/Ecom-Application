import React, { useState }  from 'react';
import { View, Text, StyleSheet,ActivityIndicator, ScrollView, Image, TextInput,TouchableOpacity,KeyboardAvoidingView, Platform } from 'react-native';
import * as yup from 'yup';

import Screen from '../componentes/Screen'
import colors from '../config/colors';
import Icons from '../componentes/Icons';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
import AppButton from '../componentes/AppButton';
import url from '../config/url';

const ukPostalCodeRegex = /^[A-Z]{1,2}\d{1,2}([A-Z]?\s?\d[A-Z]{2})?$/i;

const schema = yup.object().shape({
    name: yup.string().required(),
    zipcode: yup.string().test('ukPostalCode', 'Invalid UK postal code', (value) => {
        return ukPostalCodeRegex.test(value);
      }).required(),
    email: yup.string().email('Invalid email-ID').required('Email is required'),
    password: yup.string().min(4,"Password must be atleast 8 characters or long").required('Password is required'),
  });


function SignupScreen({navigation}) {

    const [userdata, setuserdata] = useState({
        name:"",
        email: "",
        password: "",
        zipcode: "",
    }) ;

    const [validationErrors, setValidationErrors] = useState({});
    const [errormsg, seterrormsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = () =>{
        //console.log(userdata);
        schema.validate(userdata, { abortEarly: false })
            .then((validatedData) => {
            setValidationErrors({});
            setIsLoading(true);
            fetch(`${url.localhost}/verify`,{
                method:'POST',
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify(validatedData)
            })
            .then(res => res.json()).then(
                data =>{
                    //console.log(data);
                    if (data.error) {
                            setIsLoading(false);
                            seterrormsg(data.error)
                        }
                        else{
                            setIsLoading(false);
                            alert(data.message);
                            console.log(data);
                            navigation.navigate('Verify',{userDetails:data.userdetails,code:data.code})
                        }
                }
            )

         })
            .catch((errors) => {
             // Data is invalid
             const errobj ={}
             errors.inner.forEach((error) => {
                errobj[error.path] = error.message;
              });
            setValidationErrors(errobj);
  });}
  
    return (
        <Screen>
            {isLoading && (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryblue} />
            </View>
             )}
            <ScrollView>
            
            <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/signup.png')}/>
            </View>
            <View style={styles.inputfeilds}>
            <Text style={styles.Signuptext}>Sign up</Text>
            {errormsg && <Text style={{color:"red", paddingTop:15}}>{errormsg}</Text>}
            

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            <View style={styles.textInputContainer}>
            <Icons name="face-man" size={40} iconcolor = {colors.grey}/>
            <TextInput placeholder="Full name" style={styles.textInput} onChangeText={(text) => setuserdata({...userdata,name:text})}/> 
            </View>
            {validationErrors.name && <Text style={{color:"red", paddingTop:15}}>{validationErrors.name}</Text>}
            

            <View style={styles.textInputContainer2}>
            <MaterialIcons name="alternate-email" size={40} color = {colors.grey}/>
            <TextInput placeholder="Email ID" style={styles.textInput} 
            keyboardType='email-address' 
            autoCapitalize='none' 
            autoCorrect={false} 
            textContentType='emailAddress'
            onChangeText={(text) => setuserdata({...userdata,email:text})}/> 
            </View>
            {validationErrors.email && <Text style={{color:"red", paddingTop:15}}>{validationErrors.email}</Text>}
            
            <View style={styles.textInputContainer2}>
            <Icons name="lock-outline" size={40} iconcolor = {colors.grey}/>
            <TextInput placeholder="Create a password" style={styles.textInput}
            onChangeText={(text) => setuserdata({...userdata,password:text})}
            autoCapitalize='none' 
            autoCorrect={false}
            textContentType='password'
            secureTextEntry/> 
            </View>
            {validationErrors.password && <Text style={{color:"red", paddingTop:15}}>{validationErrors.password}</Text>}
            

            <View style={styles.textInputContainer2}>
            <Icons name="map-marker-outline" size={40} iconcolor = {colors.grey}/>
            <TextInput placeholder="Zip Code" style={styles.textInput} onChangeText={(text) => setuserdata({...userdata,zipcode:text})}/> 
            </View>
            {validationErrors.zipcode && <Text style={{color:"red", paddingTop:15}}>{validationErrors.zipcode}</Text>}
            
            </KeyboardAvoidingView>
            <TouchableOpacity style ={styles.button} onPress={handleSubmit}>
            <Text style={styles.textinside}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.logintext}>Joined us before? <Text style={styles.login} onPress={() => navigation.navigate('Login')}> Login</Text></Text>

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
        alignItems:'center'
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
export default SignupScreen;