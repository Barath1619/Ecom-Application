import React, { useContext, useEffect, useState } from 'react';
import { Image, View,Text, StyleSheet, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Screen from '../componentes/Screen';
import colors from '../config/colors';
import SellerProfile from '../componentes/SellerProfile' 
import url from '../config/url';
import Swiper from 'react-native-swiper';
import AppButton from '../componentes/AppButton';
import { Context } from '../config/context';

function ItemDetailsScreen({navigation, route}) {
    const {item}= route.params
    const {token} = useContext(Context);
    const [lat, setlat] =useState(null);
    const [lan, setlan] = useState(null);
    const [message, setmessage] = useState();
    const [loading, setLoading] =  useState(false);
    const [name, setname] = useState("");

    //console.log(item.user)

    const getDetails = () =>{

      setLoading(true);
      fetch(`${url.localhost}/getseller`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({seller:item.user})
      })
        .then(res => res.json())
        .then((data) => {
          setLoading(false);
          if (data.message){
          setname(data.name);
          }
          else{
            setLoading(false);
            console.log("Something went wrong", data.error)
          }

        })
        .catch((error) => {
          setLoading(false);
          console.log("Error while sending message data:", error);
        });

    }
    

    useEffect(()=>{
        const mapapiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${item.location}&key=${url.map_api_key}`;

        fetch(mapapiUrl)
        .then(response => response.json())
        .then(data => {
         if (data.results.length > 0) {

            const location = data.results[0].geometry.location;
            //const loc ={lat:location.lat, lng:location.lng}
            setlan(location.lng);
            setlat(location.lat);
            } else {
            console.log('No results found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        getDetails();
    },[])

    const  handleSend = () =>{
      setLoading(true);
      fetch(`${url.localhost}/sendmessage`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${token}`
        },
         body: JSON.stringify({message, seller: item.user, productid:item._id })
      })
        .then(res => res.json())
        .then((data) => {
          setLoading(false);
          if (data.message){
            alert(" Message Sent ")
            
          }
          else{
            setLoading(false);
            console.log("Something went wrong", data.error)
          }

        })
        .catch((error) => {
          setLoading(false);
          console.log("Error while sending message data:", error);
        });

    }



    return (
        <ScrollView>
        <View>
       
        <Swiper style={styles.swiper} showsButtons={false} loop={true}>
          {item.imageData.length>0?item.imageData.map((image, index) => (
  
            <Image key={index} style={styles.image} source={{ uri: `data:image/jpeg;base64,${image}` }} />
          )) 
          :
          <Image  style={styles.image} source={require('../assets/noimg.png')}/>
          }
        </Swiper>
        
        <View style={styles.details}>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
        </View>
        <View style={styles.line}/>
        <View style={styles.sellerprofile}>
        <SellerProfile 
        image={require("../assets/profile.jpg")}
        title={name}
        subTitle={`posted on ${new Date(item.createdAt).toLocaleDateString()}`}
        />

        </View>

        <View style={styles.mapview}>
        {lat !== null && lan !== null && (
        <MapView
        style={styles.map}
        initialRegion={{
          latitude:  lat, 
          longitude: lan, 
          latitudeDelta: 0.00122,
          longitudeDelta: 0.005121,
        }}>
       
        <Marker
          coordinate={{ latitude: lat, longitude: lan }}
          title="Location"
          description="Item's location"
        />
      </MapView>)}
      </View>
      <TextInput placeholder="Have something to ask the seller?" style={styles.textInput} 
      onChangeText={(text)=>setmessage(text)}/>

      <TouchableOpacity style ={styles.button} onPress={handleSend}>
      <Text style={styles.textinside}>Send</Text>
      </TouchableOpacity>
            
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

  textInput:{
    width:'70%', height:60, 
    backgroundColor:colors.white,
    borderRadius:10,
    alignSelf:'center',
    textAlign:'center',
    marginTop:15,
    borderWidth:3,
    borderColor:colors.color2
  },
  button:{
    width :"40%",
    height: 50,
    alignSelf:"center",
    borderRadius:10,
    marginVertical:15,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:colors.color2,
   // marginTop:30
},
textinside:{
    fontWeight:"500",
    fontSize:23,
    color:colors.white
},
    swiper:{
        
        height:300
    },
    details:{
        padding:10
    },
    title:{
        fontWeight:"bold",
        fontSize:20
    },
    price:{
        fontWeight:"800",
        fontSize:18,
        color:colors.secondary,
        marginTop:10
    },
    line:{
        width:"80%",
        height:3,
        backgroundColor:colors.grey,
        alignSelf:"center"
    },
    sellerprofile:{
        marginVertical:15
    },

      map: {
        width: '100%',
        height: 200,
        alignSelf:"center",
       
      },
      mapview:{
        width:"95%",
        alignItems:"stretch",
        borderWidth:2,
        borderRadius:15,
        overflow:"hidden",
        alignSelf:"center",
        borderColor:colors.black
      },
      image: {
        width: '100%',
        height: 300,
      },
})

export default ItemDetailsScreen;