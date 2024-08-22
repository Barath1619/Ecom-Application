import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Screen from '../componentes/Screen';
import SellerProfile from '../componentes/SellerProfile';
import ItemSeparator from '../componentes/ItemSeparator'
import SellerProfileDeleteAction from '../componentes/SellerProfileDeleteAction';
import colors from '../config/colors';
import url from '../config/url';
import { Context } from '../config/context';
import { Modal } from 'react-native';
import Loader from '../componentes/Loader';
import { set } from 'lodash';

function MessagesScreen({navigation}) {

    const [messages, setMessages] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const {token,loadToken  } = useContext(Context);
    const [chat, setChat] = useState([]);

    const loadMessages = () => {
        setLoading(true);
      fetch(`${url.localhost}/getmessage`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${token}`
        },
        
      })
        .then(res => res.json())
        .then((data) => {
          
          if (data.message){
            setLoading(false);
            setChat(data.allchats)
            
          }

        })
        .catch((error) => {
          setLoading(false);
          console.log("Error while getting message data:", error);
        });

    }


    useEffect(()=>{

    loadMessages();

    },[])

    const handleDeleteItem = (item) =>{
        const newchat= chat.filter(m => m._id!= item._id);
        setChat(newchat);
    }

    const handleMessageOnPress = (item) => {
        setVisible(true);
        
    
    }

    

    return (

        <>
        <Screen>

            <FlatList 
            data={chat}
            keyExtractor={(item, index)=> index.toString()}
            renderItem={({item}) => 
            //console.log(item)
            <SellerProfile
            title={`Message from ${item.senderName}`}
            subTitle={`Regarding your post on ${item.product}`}
            image={require("../assets/profile.jpg")} 
            onPress={()=>navigation.navigate('Chat',{items:item})}  
            renderRightActions={() =>
            <SellerProfileDeleteAction onPress={()=>handleDeleteItem(item)}/>}
           />
            }
            ItemSeparatorComponent={ItemSeparator}
            refreshing={refresh}
            onRefresh={()=>{
                loadToken();
                loadMessages();
            }}
           />
       
        </Screen>
       
        
                {loading && <Loader/>}


        </>
        
         );
}

const styles = StyleSheet.create({
    modelTextinput:{
        width:'80%',
        height:50,
        borderWidth:2,
        borderRadius:15,
        marginTop:25,
        textAlign:'center'
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
      },
      modalContent: {
        width: '60%',
        height: 300,
        backgroundColor: colors.white,
        borderRadius: 10,
       // justifyContent: 'center',
        alignItems: 'center',
      },
      modbutton:{
        flexDirection:'row',
        position:'absolute',
        bottom:0, 
        width:'100%', 
        height:50, 
      },
      buttonokcancel:{
        justifyContent:'center',
        alignItems:'center',
        flex:1
      },
})
export default MessagesScreen;