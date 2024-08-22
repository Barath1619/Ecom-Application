import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text,ScrollView, StyleSheet, ActivityIndicator, Image, TextInput,TouchableOpacity,KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, FlatList } from 'react-native';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons, Ionicons,   MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; 

import Screen from '../componentes/Screen'
import colors from '../config/colors';
import Icons from '../componentes/Icons';
import AppButton from '../componentes/AppButton';
import { Context } from '../config/context';
import url from '../config/url';
import { Modal } from 'react-native';
import { Button } from 'react-native';


const ukPostalCodeRegex = /^[A-Z]{1,2}\d{1,2} ?\d{1,2}[A-Z]{1,2}/;
const schema = yup.object().shape({
    title: yup.string().required('title is required'),
    price: yup.string().required('price is required'),
    category: yup.string().required('category is required'),
    description: yup.string().required('description is required'),
    location: yup.string().test('ukPostalCode', 'Invalid UK postal code', (value) => {
        //console.log(value)
        return ukPostalCodeRegex.test(value);
      }).required(),
  });

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


function AddProductScreen({navigation}) {

    const {login, token, loadToken } = useContext(Context);
    const [input, setinput] =useState("");
    const [userdata, setuserdata] = useState({
        title: "",
        price: "",
        category:"",
        description:"",
        location:""
    }) ;
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [errormsg, seterrormsg] = useState(null);
    const [modalvisible, setmodalvisible] = useState(false);
    const [imageUri, setImageUri] = useState([]);
    



    const getPermission = async () =>{
        const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!granted) alert("You need to enable permissions to access Camera roll")
    }
    useEffect(()=>{
    loadToken();
    setuserdata({
        title: "",
        price: "",
        category:"",
        description:"",
        location:""
    });
    setinput("");
    getPermission();
    },[])

    const handleSubmit = () =>{
        
        setIsLoading(true);

        schema.validate(userdata, { abortEarly: false })
             .then((validatedData) => {
        
            setValidationErrors({});

            const formData = new FormData();
            Object.keys(userdata).forEach((key) => {
                formData.append(key, userdata[key]);
            });
        
    
            imageUri.forEach((uri, index) => {
                const imageName = `image${index}`;
                formData.append('images', {
                  uri: uri,
                  type: 'image/jpeg', 
                  name: `${imageName}.jpg`, 
                });
              });

            fetch(`${url.localhost}/addpost`, {
                method:'POST',
                headers:{
                    'Content-Type':"multipart/form-data",
                    'Authorization':`Bearer ${token}`
                },
                body: formData
            }).then( res => res.json()).then(data =>{
                if (data.error){
                    setIsLoading(false);
                    alert(data.error);
                }
                else{
                    setIsLoading(false);
                    alert(data.message);
                    navigation.navigate("Productstack");
                    setuserdata({
                        title: "",
                        price: "",
                        category:"",
                        description:"",
                        location:"",
                    });
                    setImageUri([]);
                }
            })

         })
            .catch((errors) => {
             // Data is invalid
             const errobj ={}
             errors.inner.forEach((error) => {
                errobj[error.path] = error.message;
              });
            setIsLoading(false);
            setValidationErrors(errobj);
  });

    }


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

    const selectImg = async () =>{
 
        if (imageUri.length >= 3) {
            alert('You can only select up to 3 images.');
            return;
          }
        try {
                const result = await ImagePicker.launchImageLibraryAsync(
                    {
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsMultipleSelection: true,
                      }
                );
                if(!result.canceled){
                    const newUri = result.assets.map((assert)=>assert.uri);
                    const selectedUris =[...imageUri, ...newUri]
                    if (selectedUris.length <= 3) {
                    setImageUri(selectedUris)
                } else {
                    alert('You can only select up to 3 images.');
                  }
                }
        } catch (error) {
            console.log("error selecting the image", error)
        }
    }

    const deleteImage = (index) => {
        const updatedImageUris = imageUri.filter((_, i) => i !== index);
        setImageUri(updatedImageUris);
      };


    return (
        <Screen>
            {isLoading && (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryblue} />
            </View>
             )}
            <ScrollView >
            
            
            <Text style={styles.text}> Post Item</Text>
            <View style={styles.inputfeilds}>
            {errormsg && <Text style={{color:"red", paddingTop:15, paddingHorizontal:34}}>{errormsg}</Text>}
        
            

            <View style={styles.textInputContainer2}>
            <FontAwesome5 name="tshirt" size={40} color = {colors.grey}/>
            <TextInput 
            value={userdata.title}
            placeholder="Product Title" 
            style={styles.textInput}
            onChangeText={(text)=>setuserdata({...userdata,title:text})}
            /> 
            </View>
            {validationErrors.title&&<Text style={{color:"red",paddingTop:15, paddingHorizontal:34}}>{validationErrors.title}</Text>}


            <View style={styles.textInputContainer2}>
            <MaterialIcons name="description" size={40} color = {colors.grey}/>
            <TextInput 
            value={userdata.description}
            placeholder="Description" 
            style={styles.textInput} 
            onChangeText={(text)=>setuserdata({...userdata,description:text})}
            /> 
            </View>
            {validationErrors.description && <Text style={{color:"red", paddingTop:15, paddingHorizontal:34}}>{validationErrors.description}</Text>}
            
                {/* Category */}

            <View style={styles.textInputContainer2}>
            <MaterialCommunityIcons name="apps-box" size={40} color = {colors.grey}/>
            <TouchableWithoutFeedback onPress={()=>setmodalvisible(true)}>
            <View 
            value={userdata.category}
            style={styles.category}
            onChangeText={(text)=>setuserdata({...userdata,category:text})}
            >
            <Text >{userdata.category?userdata.category:"Category"}</Text>
            <MaterialCommunityIcons name="chevron-down" size={40} color = {colors.grey}/>
            </View> 
            </TouchableWithoutFeedback>
            <Modal visible={modalvisible} animationType='slide'>
                <Button title='close' onPress={()=>setmodalvisible(false)}></Button>
                <Text>Select a Category</Text>

                <FlatList
                data={items}
                keyExtractor={item => item.value.toString()}
                renderItem={({item})=><PickerItem  item={item} onPress={()=>{
                  //console.log(item)
                    setuserdata({...userdata,category:item.label})
                    setmodalvisible(false)
                    
                }}/>}
                numColumns={3}/>

            </Modal>

            </View>
            {validationErrors.category&&<Text style={{color:"red",paddingTop:15, paddingHorizontal:34}}>{validationErrors.category}</Text>}


            <View style={styles.textInputContainer2}>
            <FontAwesome5  style={{paddingHorizontal:10}} name="pound-sign" size={40} color = {colors.grey}/>
            <TextInput 
            value={userdata.price}
            placeholder="Price" 
            keyboardType='number-pad'
            style={styles.textInput}
            onChangeText={(text)=>setuserdata({...userdata,price:text})}
            /> 
            </View>

            {validationErrors.price&&<Text style={{color:"red",paddingTop:15, paddingHorizontal:34}}>{validationErrors.price}</Text>}


            <View style={styles.textInputContainer2}>
            <Ionicons  name="location" size={40} color = {colors.grey}/>
            <TextInput 
            value={userdata.location}
            placeholder="Location" 
            case
            style={styles.textInput}
            onChangeText={(text)=>setuserdata({...userdata,location:text.toUpperCase()})}
            /> 
            </View>
            {validationErrors.location && <Text style={{color:"red",paddingTop:15, paddingHorizontal:34 }}>{validationErrors.location}</Text>}
            </View>
            
            
            <ScrollView 
            horizontal
            contentContainerStyle={styles.cameraselectview}>
            
            {imageUri.map((uri, index) => (
                <TouchableOpacity
                key={index}
                onPress={() => deleteImage(index)} // Call the deleteImage function on press
              >
                <Image  source={{ uri }} style={styles.cameraselect}  />
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cameraselect} onPress={selectImg} >
                            <Icons iconcolor={colors.white} name="camera" size={50}/>
               
            </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style ={styles.button} onPress={handleSubmit}>
            <Text style={styles.textinside}>Post</Text>
            </TouchableOpacity>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      },
    scrollview:{
        justifyContent:'center',
        
    },
    cameraselect:{
        height:120, 
        width:120, 
        justifyContent:"center", 
        alignItems:"center" , 
        borderRadius:15,
        backgroundColor:colors.grey,
        margin:3
    },
    cameraselectview:{
        paddingHorizontal:15,
        paddingVertical:40,
        flexDirection:"row",
    },
    textInputContainer2:{
        flexDirection:'row',
        marginTop:30,
        marginHorizontal:20,
        alignItems:'center',
        justifyContent:"space-between"
    },
    textInput:{
        width:"85%",
        height:60,
        borderBottomColor:colors.grey,
        borderBottomWidth:2,
    },
    category:{
        width:"85%",
        height:60,
        borderBottomColor:colors.grey,
        borderBottomWidth:2,
        alignItems:"center",
        justifyContent:"space-between",
        color:colors.grey,
        flexDirection:"row"

    },
    picker:{
        padding:5,
       
    },
    button:{
        width :"90%",
        height: 55,
        alignSelf:"center",
        borderRadius:10,
        marginVertical:10,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:colors.primaryblue,
       // marginTop:30
    },
    textinside:{
        fontWeight:"500",
        fontSize:23,
        color:colors.white
    },
    text:{
        color:colors.grey,
        fontSize: 50,
        fontWeight:"900"
    }
})
export default AddProductScreen;