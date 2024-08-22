import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Context = createContext();

function ContextProvider({children}) {

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    if(loading){
      return(
        <Loader/>
      )
    }


    const login = (usertoken) =>{
        console.log("context",usertoken);
        setToken(usertoken);
        AsyncStorage.setItem("token", usertoken);
    }

    const logout = () =>{
        setToken(null);
        AsyncStorage.removeItem("token");
    }

    const loadToken = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          setToken(token);
         
        } catch (error) {
          console.log(error);
        }
      }
      useEffect( () => {
        setLoading(true);
        loadToken();
        setLoading(false);
      },[])



    return (
        <Context.Provider value={{login, logout,loadToken, token}}>
            {children}
        </Context.Provider>
    );
}

export default ContextProvider;