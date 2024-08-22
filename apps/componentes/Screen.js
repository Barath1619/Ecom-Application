import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import colors from '../config/colors';

function Screen({children}) {
    return (
        <View style={styles.topcontainer}>
        <SafeAreaView style={styles.container}>
            {children}
        </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    topcontainer:{
        flex:1,
        backgroundColor:colors.white
    },
    container:{
        marginTop: Platform.OS === "ios"? 0 : StatusBar.currentHeight,
        flex:1,
        backgroundColor:colors.white,
       
    }
})

export default Screen;