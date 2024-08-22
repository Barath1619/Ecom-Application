import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import colors from '../config/colors';

function Loader(props) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={'large'} color={colors.primaryblue}></ActivityIndicator>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        zIndex: 1,
    }
})

export default Loader;