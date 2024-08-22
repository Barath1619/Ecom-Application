import React, { useContext, useEffect, useState } from 'react';
import Screen from '../componentes/Screen';
import { Modal, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import colors from '../config/colors';
import { FlatList } from 'react-native';
import CardComp from '../componentes/CardComp';
import { Context } from '../config/context';
import url from '../config/url';
import Loader from '../componentes/Loader';
import { Entypo } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { date } from 'yup';

function Myproducts(props) {

    const {logout,token} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [postings, setPostings] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);

    const loadData = () =>{
        setLoading(true);
        fetch(`${url.localhost}/listmyproducts`, {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
              'Authorization': `Bearer ${token}`
            },
          })
            .then(res => res.json())
            .then((data)=>{
              setLoading(false);
              setPostings(data.allpostings)
            })
            .catch((error) => {
                console.error("Error while getting data:", error);
               setLoading(false);
              });
    }

    const onRefresh = () =>{
        setRefreshing(true);
        fetch(`${url.localhost}/listmyproducts`, {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
              'Authorization': `Bearer ${token}`
            },
          })
            .then(res => res.json())
            .then((data)=>{
              setRefreshing(false);
              setPostings(data.allpostings)
            })
            .catch((error) => {
                console.error("Error while getting data:", error);
               setRefreshing(false);
              });
    }

    useEffect(()=>{
        loadData();
    },[]);

    const handleDeletePress = (postingId) => {
        Alert.alert(
            'Delete Posting',
            'Are you sure you want to delete this posting?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        setLoading(true);
                        fetch(`${url.localhost}/deletemyproducts`, {
                            method: "POST",
                            headers: {
                              'Content-Type': "application/json",
                              'Authorization': `Bearer ${token}`
                            },
                        body: JSON.stringify({postingId})
                          })
                            .then(res => res.json())
                            .then((data)=>{
                                if(data.message){
                                    alert(data.message);
                                    setPostings(data.allpostings);
                                    setLoading(false);
;                                }
                                else if(data.error){
                                    alert("Something went wrong");
                                    console.log(data.error);
                                    setLoading(false);
                                }
                            })

                       
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <>
       <Screen>
        

       <Text style={styles.text}> My Products</Text>
        {/* flatlist */}
        <FlatList
            data={postings}
            keyExtractor={(item) => item._id}
            renderItem={ ({item}) => <CardComp
            imageuri={
              item.imageData
            }
            date={item.createdAt.split('T')[0]}
            title={item.title} 
            zip={item.location} 
            price={item.price} 
            onPress={() => handleDeletePress(item._id)} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
            { postings.length === 0 && <Text style={styles.text2}>No Feeds to show, Please come back later </Text>  }
           
            

       </Screen>
        {loading&&<Loader/>}

        </>
    );
}

const styles = StyleSheet.create({

    text:{
        color:colors.grey,
        fontSize: 50,
        fontWeight:"900",
        
    },
    text2:{
        color:colors.grey,
        fontSize: 40,
        marginHorizontal:5,
        fontWeight:"900"
    },
})

export default Myproducts;
