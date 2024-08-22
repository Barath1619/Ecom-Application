import React, { useContext, useEffect, useRef, useState } from 'react';
import { View,Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Image} from 'react-native';

import Screen from '../componentes/Screen'
import colors from '../config/colors';
import CardComp from '../componentes/CardComp';
import Loader from '../componentes/Loader';
import { Context } from '../config/context';
import url from '../config/url';
import io from 'socket.io-client';
import { Entypo } from '@expo/vector-icons'; 
import { Button } from 'react-native';
import Icons from '../componentes/Icons';
import _ from 'lodash';
import ReccommendedProdCard from '../componentes/ReccommendedProdCard';
import { date } from 'yup';


const items = [
  {
      label:"Furnitures",
      value:1,
      bgcolor:colors.color1,
      icon:""
  },
  {
      label:"Sports",
      value:2,
      bgcolor:colors.color2,
      icon:""},
   {
      label:"Clothing",
      value:3,
      bgcolor:colors.color3,
      icon:""
      },
      {
          label:"Shoes",
          value:4,
          bgcolor:colors.color4,
          icon:""
          },
          {
              label:"Camera",
              value:5,
              bgcolor:colors.color5,
              icon:""
              },
              {
                  label:"Electronics",
                  value:6,
                  bgcolor:colors.color6,
                  icon:""
                  },
                  {
                      label:"Books",
                      value:7,
                      bgcolor:colors.color7,
                      icon:""
                      },
                      {
                          label:"Decors",
                          value:8,
                          bgcolor:colors.color8,
                          icon:""
                          },
              {
                  label:"others",
                  value:9,
                  bgcolor:colors.color9,
                  icon:""
                  }
]




function ProductScreen({navigation}) {

    const [postings, setPostings] = useState([]);
    const [Bpostings, setBPostings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const {login, token, loadToken} = useContext(Context);
    const [zipcode, setzipcode] = useState(null);
    const [userzip, setuserzip] = useState('');
    const [itemsLoaded, setItemsLoaded] = useState(5);
    const [listloading, setListLoading] = useState(false);
    const [modalvisible, setmodalvisible] = useState(false);
    const [category, setCategory] = useState("Category");
    const [searchQuery, setSearchQuery] = useState("");
    const [visible, setVisible] = useState(false);
    const [modaltext, setmodaltext] =useState('');
    const [modalerror, setmodalerror] =useState(null);

    const [recommendation, setrecommendation] = useState([]);
    

    const debouncedSearch = useRef(_.debounce((text) => sendRecommend(text), 2000)).current;



    const getDistance = (coordinate1, coordinate2) => {
      if(coordinate1&&coordinate2){
        const lat1 = coordinate1.latitude;
        const lon1 = coordinate1.longitude;
        const lat2 = coordinate2.latitude;
        const lon2 = coordinate2.longitude;
      
        const R = 6371; 
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
      
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        const distance = R * c; // Distance in km
        return distance;
      }else{
        return null;
      }
    };


    //Recommendation function 
    

    const sendRecommend = (words) =>{
      fetch(`${url.localhost}/addrecommendation`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({words})
      })
        .then(res => res.json())
        .then((data) => {
          if (data.message){
            console.log("data added to db")
          }
          else{
            console.log("Something went wrong", data.error)
          }

        })
        .catch((error) => {
          console.log("Error while sending recommendation data:", error);
        });

    }
//Recommendation
    const getRecommend = () =>{
      fetch(`${url.localhost}/getrecommendation`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${token}`
        },
        
      })
        .then(res => res.json())
        .then((data) => {
          setrecommendation(data.allpostings)
        })
        .catch((error) => {
          console.log("Error while getiing recommendation data:", error);
        });

    }
    

    const onRefresh = () => {
        setLoading(true);
        
        fetch(`${url.localhost}/listpostings`, {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
          },
        })
          .then(res => res.json())
          .then((data) => {
            if (data.error) {
             
              console.log(data.error);
            } else {
              
              setuserzip(data.location);
              setPostings(data.postings);
              setBPostings(data.allpostings);
            }
            setRefreshing(false);
            setLoading(false) 
          })
          .catch((error) => {
            console.error("Error while refreshing data:", error);
            setRefreshing(false); 
            setLoading(false)
          });
      };

    useEffect(() => {

        loadToken();

    },[])

    useEffect(()=>{
        
        if(token){
            onRefresh();
            getRecommend();
        }
    },[token])

    const fetchMorePostings = () => {
     
      setListLoading(true);
      fetch(`${url.localhost}/listpostings`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skip: itemsLoaded }), 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            setuserzip(data.location);
            categorySearch(category);
            handleSearch(searchQuery);
            setPostings([...postings, ...data.postings]); 
            setItemsLoaded(itemsLoaded + data.postings.length);
          }
          setListLoading(false);
        })
        .catch((error) => {
          console.error("Error while fetching more data:", error);
          setListLoading(false);
        });
    };

    const PickerItem = ({ onPress, item}) =>{

      return(
          <TouchableOpacity onPress={onPress}>
              <View style={{paddingHorizontal:30, paddingVertical:15, alignItems:"center"}}>
              <View style={{width:80, height:80, backgroundColor:item.bgcolor, justifyContent:"center", alignItems:"center", borderRadius:55}}>
              <Icons name="apps-box" iconcolor="white" size={40} />
              </View>
              <Text style={{paddingTop:5}}>{item.label}</Text>
              </View>
              
          </TouchableOpacity>
      );
  }
 const categorySearch = (text) => {
  if(text!="others"){
    const filteredPostings = Bpostings.filter((item) =>
    item.category.toLowerCase().includes(text.toLowerCase())||item.title.toLowerCase().includes(text.toLowerCase()) || item.description.toLowerCase().includes(text.toLowerCase())  ); 
    setPostings(filteredPostings)
    debouncedSearch(text);
  }
  else{
      setPostings(Bpostings)
    }
 } 

  const handleSearch = (text) =>{
    
    setSearchQuery(text);
    if(text){
      const filteredPostings = Bpostings.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase()) || item.description.toLowerCase().includes(text.toLowerCase())  ); 
      setPostings(filteredPostings);
      debouncedSearch(text);
    }
    else{
      setPostings(Bpostings)
    }
  }

  const getCoordinatesForZipcode = async (zipcode) => {

    
    const mapapiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${url.map_api_key}`;

    try {
      const response = await fetch(mapapiUrl);
      const data = await response.json();
  
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const latlan = {
          latitude: location.lat,
          longitude: location.lng,
        };
  
        return latlan;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }

  }


  const handleOK = async () =>{
    const ukPostalCodeRegex = /^[A-Z]{1,2}\d{1,2}([A-Z]?\s?\d[A-Z]{2})?$/i;
    const validate = ukPostalCodeRegex.test(modaltext);
    if(validate){
      
      setLoading(true)
      setmodalerror('')
      setzipcode(modaltext);
      setVisible(false);
      const coordinate =await  getCoordinatesForZipcode(modaltext);
      console.log(coordinate)
  
      if (coordinate) {
        // Filter postings based on a 5-mile radius
        const filteredPostings = [];
        for (const item of Bpostings) {
          const pordCoordinate = await getCoordinatesForZipcode(item.location);
          const distance = getDistance(coordinate, pordCoordinate);
          
          const miles = distance / 1.609;
          console.log(miles, distance)
          if (miles <= 5 ) {
            filteredPostings.push(item);
          }
        }
        setLoading(false)
        setPostings(filteredPostings);
      }
      else{
        console.log("false")
        setLoading(false)
      }


    }
    else{
      setmodalerror('Please enter valid zipcode');
    }
  } 

   {/* Recommendations */}

  const Recommendation = () =>{
    return(

      <View style={
        {
          width:'100%',
          height:200,
          padding:10,
        }
      }>
        <Text>Reccomended Products</Text>

       <FlatList
       data={recommendation}
       keyExtractor={(item) => item._id}
       horizontal
       renderItem={({item}) => <ReccommendedProdCard 
       image={item.imageData[0]}
       title={item.title}
       price={item.price}
       onPress={()=>navigation.navigate('Productsdetails',{item})}/>}
        />

      </View>

    );
  }

    return (

        <>

        {loading && <Loader/>}
        <Screen>
          <View style={{flexDirection:"row"}}>
          <Text style={styles.text}> Feeds </Text>
            <TouchableOpacity style={styles.textcontainer2} onPress={()=>setVisible(true)}>
            <Text style={styles.textZip} >{zipcode||""}</Text>
            <Entypo name="location-pin" size={30} color={colors.grey} />
            </TouchableOpacity>

          </View>
          <View style={{flexDirection:"row",justifyContent:"space-between", paddingHorizontal:10,paddingVertical:5}}>
          
          <TextInput  
          style={styles.search} 
          placeholder="Search"
          autoCorrect
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
          clearButtonMode="while-editing"/>

           
         
          <TouchableOpacity style={styles.category} onPress={()=>{setmodalvisible(true)}}>
          <Text style={{color:colors.white}}>{category}</Text>
          </TouchableOpacity>

  
          </View>
            {/* postings   */}
            <FlatList
            data={postings}
            keyExtractor={(item) => item._id}
            renderItem={ ({item,index}) => (index>1 && index%5==0 ?
            <>
            <Recommendation/>
            <CardComp
            imageuri={item.imageData}
            date={item.createdAt.split('T')[0]}
            title={item.title} zip={item.location} price={item.price} 
            onPress={()=>navigation.navigate('Productsdetails',{item})} />
            
            </>
            :
            <CardComp
            imageuri={item.imageData}
            date={item.createdAt.split('T')[0]}
            title={item.title} zip={item.location} price={item.price} 
            onPress={()=>navigation.navigate('Productsdetails',{item})} />
            )
            

          
          }
            refreshing={refreshing}
            //onRefresh={onRefresh}
            //initialNumToRender={3}
            onEndReached={fetchMorePostings}
            onEndReachedThreshold={0.1}
            ListFooterComponent={listloading && <View style={{ height:100, justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size={'large'} color={colors.primaryblue}></ActivityIndicator>
            </View>}
            />
            { postings.length === 0 && <Text style={styles.text2}>No Feeds to show, Please come back later </Text>  }
           
        </Screen>
        {/* Model for category */}
        <Modal visible={modalvisible} animationType='slide'>
                <Button title='close' onPress={()=>setmodalvisible(false)}></Button>
                <Text>Select a Category</Text>

                <FlatList
                data={items}
                keyExtractor={item => item.value.toString()}
                renderItem={({item})=><PickerItem  item={item} onPress={()=>{
                  
                    setCategory(item.label);
                    categorySearch(item.label);
                    setmodalvisible(false)
                    
                }}/>}
                numColumns={3}/>

            </Modal>

            {/* location modal for location filter */}

            <Modal 
            visible={visible}
            animationType='fade'
            transparent
            style={styles.modelstyle}>
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Entypo name="location-pin" size={100} color={colors.grey} />
              <Text style={{marginTop:10}}>
                Set your desired  location.
              </Text>
              <TextInput style={styles.modelTextinput} onChangeText={(text) => setmodaltext(text)} />
              { modalerror && <Text style={{marginTop:10, color:colors.red}}>
                {modalerror}
              </Text>}
              <View style={styles.modbutton}>
                <TouchableOpacity style={styles.buttonokcancel} onPress={handleOK}>
                <Text>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonokcancel} onPress={() => setVisible(false)}>
                <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            </View> 
              

            </Modal>
        
                {loading && <Loader/>}

        </>
    );
}

const styles = StyleSheet.create({
  modelTextinput:{
    width:'80%',
    height:50,
    borderWidth:2,
    borderRadius:15,
    marginTop:25,
    textAlign:'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  modalContent: {
    width: '60%',
    height: 300,
    backgroundColor: colors.white,
    borderRadius: 10,
   // justifyContent: 'center',
    alignItems: 'center',
  },
  modbutton:{
    flexDirection:'row',
    position:'absolute',
    bottom:0, 
    width:'100%', 
    height:50, 
  },
  buttonokcancel:{
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
    search:{
        width:280,
        height:40,
        paddingHorizontal:20,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:25,
        backgroundColor:colors.white,
        borderWidth:2,
        borderColor:"grey"
    },
    category:{
      width:110,
      height:40,
      justifyContent:"center",
      alignItems:"center",
      borderRadius:25,
      backgroundColor:"grey"
  },
    text:{
        color:colors.grey,
        fontSize: 50,
        fontWeight:"900",
        flex:1
    }
    ,
    text2:{
        color:colors.grey,
        fontSize: 40,
        marginHorizontal:5,
        fontWeight:"900"
    },
    textcontainer2:{
      flexDirection:"row-reverse",
      paddingLeft:20,
      paddingRight:3,
      alignItems:"center",
  },
  textZip:{
      fontSize:15,
      fontWeight:"600",
      color:colors.grey

  }
})

export default ProductScreen;