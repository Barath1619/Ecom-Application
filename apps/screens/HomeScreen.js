import React from 'react';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons'; 
import ProfileScreen from './ProfileScreen'
import AddProductScreen from './AddProductScreen';
import ProductScreen from './ProductScreen';
import { createStackNavigator } from '@react-navigation/stack';

import colors from '../config/colors';
import ItemDetailsScreen from './ItemDetailsScreen';
import Myproducts from './Myproducts';
import MessagesScreen from './MessagesScreen'
import ChatScreen from './ChatScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Productstack = () => {
    return(
    <Stack.Navigator>
        <Stack.Screen name='Products' component={ProductScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Productsdetails' component={ItemDetailsScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
    );
};

const Profilestack = () => {
  return(
  <Stack.Navigator>
      <Stack.Screen name='Profile' component={ProfileScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Myproducts' component={Myproducts} options={{headerShown:false}}/>
      <Stack.Screen name='Messages' component={MessagesScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Chat' component={ChatScreen} options={{headerShown:false}}/>
  </Stack.Navigator>
  );
};



function HomeScreen({navigation}) {
    return (
    <Tab.Navigator
    screenOptions={{headerShown:false, tabBarStyle:{height:60}, tabBarHideOnKeyboard:true
      }}
    >
      <Tab.Screen name="Productstack" component={Productstack} options={{ 
        tabBarShowLabel:false,
        tabBarIcon:({color,focused, size})=>( focused ? <Ionicons name="shirt" size={40} color={color}/>:<Ionicons name="shirt-outline" size={30} color={color}/> )
      }}  />
      <Tab.Screen name='Add' component={AddProductScreen} options={{ 
        tabBarShowLabel:false,
        tabBarIcon:({color,focused})=>( focused ? <MaterialCommunityIcons name="plus-circle" size={50} color="black" />:<MaterialCommunityIcons name="plus-circle-outline" size={30} color="black" /> ),
     }}/>
      <Tab.Screen name="Profilestack" component={Profilestack} options={{ 
        tabBarShowLabel:false,
        tabBarIcon:({color,focused})=>( focused ? <MaterialCommunityIcons name="account-circle" size={40} color={color} />:<MaterialCommunityIcons name="account-circle-outline" size={30} color={color} /> )
      }}/>
    </Tab.Navigator>
    );
}

export default HomeScreen;