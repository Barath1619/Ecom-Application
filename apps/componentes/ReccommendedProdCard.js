import React from 'react';
import { Text } from 'react-native';
import { Image } from 'react-native';
import { View } from 'react-native';
import colors from '../config/colors';
import { TouchableOpacity } from 'react-native';

function ReccommendedProdCard({image, title, price, onPress}) {
    return (
        <TouchableOpacity style={{
            width:120,
            height:150,
            marginTop:10,
            backgroundColor:colors.white,
            overflow:"hidden",
            marginRight: 10,
            justifyContent:'center',
            alignItems:"center",
            borderRadius:5,
          }}
          onPress={onPress}>
            <Image style={
              {width:'100%',
              height:'70%',
              resizeMode:"stretch",
              marginBottom:3
          }
          } source ={image!=null?{ uri:`data:image/jpeg;base64,${image}` }:require('../assets/noimg.png')}/>
          <Text>{title}</Text>
          <Text style={{color:colors.green }}>${price}</Text>
          </TouchableOpacity>
    );
}

export default ReccommendedProdCard;