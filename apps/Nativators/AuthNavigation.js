import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LogInScreen from '../screens/LogInScreen';
import SignupScreen from '../screens/SignupScreen';
import MessagesScreen from '../screens/MessagesScreen';
import Verifyscreen from '../screens/Verifyscreen';
import HomeScreen from '../screens/HomeScreen';


function AuthNavigation(props) {
    const Stack = createNativeStackNavigator();
    return (
        
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown:false}} />   
          <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}} />
          <Stack.Screen name="Verify" component={Verifyscreen} options={{headerShown:false}} />
          <Stack.Screen name="Login" component={LogInScreen} options={{headerShown:false}} />
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
        </Stack.Navigator>
        
    );
}

export default AuthNavigation;