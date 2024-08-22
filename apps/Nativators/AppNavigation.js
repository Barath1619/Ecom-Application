import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import WelcomeScreen from '../screens/WelcomeScreen';
import LogInScreen from '../screens/LogInScreen';
import SignupScreen from '../screens/SignupScreen';
import MessagesScreen from '../screens/MessagesScreen';
import Verifyscreen from '../screens/Verifyscreen';
import HomeScreen from '../screens/HomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import url from '../config/url';
import { Context } from '../config/context';

function AppNavigation(props) {

  const [expoPushToken, setExpoPushToken] = useState('');
  const {token} = useContext(Context);
  const [notification, setNotification] = useState(false);

  const sendPushToken = ( pushToken ) =>{
    
    fetch(`${url.localhost}/getpushtoken`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({pushToken})
      })
        .then(res => res.json())
        .then((data)=>{
            console.log(data.message)
        })
        .catch((error) => {
            console.error("Error send push token:", error);
           
          });
}

  const registerForPushNotifications = async () => {

    try{

      const permission = await Notifications.getPermissionsAsync();
      const projectId = '9aadc516-a0dc-42df-9ab9-51e6ae1ab944';
      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      sendPushToken(token)

    }catch(err){

      console.log("error geting the token for notification",err)
    }
   
     
  }

  

    const Stack = createNativeStackNavigator();
    return (
        
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
          <Stack.Screen name="Addpost" component={AddProductScreen} options={{headerShown:false}} />
          <Stack.Screen name="Login" component={LogInScreen} options={{headerShown:false}} />
          <Stack.Screen name="Messages" component={MessagesScreen} options={{headerShown:false}} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown:false}} />   
          <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}} />
          
        </Stack.Navigator>
       
    );
}

export default AppNavigation;