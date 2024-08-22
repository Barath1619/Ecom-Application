import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import AppButton from '../componentes/AppButton';
import { Context } from '../config/context';
import { StyleSheet } from 'react-native';
import SellerProfile from '../componentes/SellerProfile';
import Screen from '../componentes/Screen';
import colors from '../config/colors';
import Icons from '../componentes/Icons';
import Loader from '../componentes/Loader';
import { Text } from 'react-native';
import url from '../config/url';
import { TouchableOpacity } from 'react-native';


function ProfileScreen({navigation}) {

    const {logout,token} = useContext(Context);
    const [name, setName] = useState("");
    const [email, setemail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        logout();
        navigation.navigate('Login')
    }
    const loadData = ( ) =>{
        setLoading(true);
        fetch(`${url.localhost}/getuserdetails`, {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
              'Authorization': `Bearer ${token}`
            },
          })
            .then(res => res.json())
            .then((data)=>{
                setName(data.name);
                setemail(data.email);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error while getting data:", error);
                setLoading(false);
              });
    }

    useEffect(()=>{
        loadData();
    },[]);


    return (
        <>
        <Screen>
        <View style={styles.container}>
        <SellerProfile 
        image={require("../assets/profile.jpg")}
        title={name}
        subTitle={email}
        />
        <View style={{width:'95%',alignSelf:"center", backgroundColor:colors.grey, height:2}}>
        </View>

        {/* my products */}
        <TouchableOpacity style={[styles.list, {marginTop:60}]} onPress={()=>navigation.navigate('Myproducts')}>
        <View style={styles.viewForIcon}>
        <Icons name='view-list' size={35} iconcolor={colors.white} />
        </View>
        <Text style={{
            marginHorizontal:15,
            fontSize:19,
            fontWeight:'600',
            flex:1
        }}>Products</Text>
        <Icons name='chevron-right' size={40} iconcolor={colors.grey} />
        </TouchableOpacity>
         {/* my messages */}
         <TouchableOpacity style={styles.list} onPress={()=>navigation.navigate('Messages')}>
        <View style={[styles.viewForIcon, {backgroundColor:colors.color5}]}>
        <Icons name='message-text' size={35} iconcolor={colors.white} />
        </View>
        <Text style={{
            marginHorizontal:15,
            fontSize:19,
            fontWeight:'600',
            flex:1
        }}>Messages</Text>
        <Icons name='chevron-right' size={40} iconcolor={colors.grey} />
        </TouchableOpacity>

        <View style={styles.logout}>
        <AppButton title="Log Out" onPress={handleSubmit}/>
        </View>
        </View>
        </Screen>
        {loading&&<Loader/>}
        </>
    );
}

const styles = StyleSheet.create({
    viewForIcon:{
        width:55, 
        height:55, 
        borderRadius:50, 
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:colors.color2,
    },
    container:{
        flex:1,
        backgroundColor:colors.default
    },
    
    logout:{
        position:"absolute",
        bottom:20,
        width:'100%',
        alignItems:'center'
    },
    list:{
        width:'100%',
        height:75,
        marginVertical:1,  
        flexDirection:"row",
        alignItems:"center",
        padding:5,
        paddingLeft:15,
        paddingRight:10,    
        backgroundColor:colors.white
    }
})

export default ProfileScreen;