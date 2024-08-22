import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Screen from '../componentes/Screen';
import colors from '../config/colors';
import url from '../config/url';
import { Context } from '../config/context';

const ChatScreen = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {items} = route.params;
  const {token  } = useContext(Context);

  console.log(items);




  const renderItem = ({ item }) => {
    const isSender = item.isSender === items.sender;
    return(
    <View
    style={[
      styles.messageContainer,
      isSender ? styles.senderMessage : styles.receiverMessage,
    ]}
  >
    <Text style={[isSender?styles.messageText2:styles.messageText]}>{item.text}</Text>
  </View>
  );
}

  const loadMessages = () => {
    const msg = [];
    Object.keys(items.message).forEach(key => {
      const [isSender, timestamp] = key.split('$');
      const text = items.message[key];
      msg.push({
        isSender,
        timestamp,
        text
      });
    });
    setMessages(msg);
  }

  useEffect(()=>{
    loadMessages();
  },[]);

  const handleSend = () => {
    if (newMessage.trim() === '') {
      return;
    }
    const updatedMessages = [...messages, { text: newMessage}];
    setMessages(updatedMessages);
   

    fetch(`${url.localhost}/sendmessagechat`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${token}`
        },
         body: JSON.stringify({message:newMessage, receiver: items.receiver  })
      })
        .then(res => res.json())
        .then((data) => {
        
          if (data.message){
            alert(" Message Sent ")
          }
          else{
           
            console.log("Something went wrong", data.error)
          }

        })
        .catch((error) => {
          setLoading(false);
          console.log("Error while sending message data:", error);
        });

  };

  return (
    <Screen>
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require("../assets/profile.jpg")} style={styles.profileImage} />
        <Text style={styles.profileName}>{items.senderName}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#F5F5F5',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  senderMessage: {
    alignSelf: 'flex-end', 
    backgroundColor: '#2979FF', 
    marginLeft: 50, 
  },
  receiverMessage: {
    alignSelf: 'flex-start', 
    backgroundColor: '#E1E1E1', 
    marginRight: 50, 
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileName: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    backgroundColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  messageText2: {
    fontSize: 16,
    color:colors.white
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#C0C0C0',
    paddingTop: 8,
    paddingBottom:8,
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: 'blue',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;