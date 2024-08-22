import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import WelcomeScreen from './apps/screens/WelcomeScreen';
import ItemDetailsScreen from './apps/screens/ItemDetailsScreen';
import LogInScreen from './apps/screens/LogInScreen';
import AppNavigation from './apps/Nativators/AppNavigation';
import SignupScreen from './apps/screens/SignupScreen';
import Verifyscreen from './apps/screens/Verifyscreen'
import AuthNavigation from './apps/Nativators/AuthNavigation';
import ContextProvider, { Context } from './apps/config/context';
import { useContext } from 'react';

import Loader from './apps/componentes/Loader';
import NavigationControl from './apps/Nativators/NavigationControl';


export default function App() {

 
 
  return (
    <ContextProvider>
      <NavigationControl/>
    </ContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
