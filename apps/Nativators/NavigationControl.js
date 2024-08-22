import React, { useContext } from 'react';
import { Context } from '../config/context';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import AppNavigation from './AppNavigation';
import Loader from '../componentes/Loader';

function NavigationControl(props) {
    const{loading, token} = useContext(Context);
  
    if(loading){
        return(
          <Loader/>
        )
      }

    return (
        <NavigationContainer>
            { token !== null ?<AppNavigation/>:<AuthNavigation/>}
        </NavigationContainer>
    );
}

export default NavigationControl;