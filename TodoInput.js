import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  Text,
  Pressable,
  Button,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from "@expo/vector-icons";

export default function TodoInput({addToDo, onChangeText, text, visible, toggle, date, setDate}){
      const [mode, setMode] = useState('date');
      const [show, setShow] = useState(false);
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };
      return(
          <Modal 
            visible={visible} 
            transparent={true} 
            onRequestClose={toggle}>
              <View style={styles.shadow}></View>
              <View style={styles.main}>
              <Text style={styles.mainText}>당신의 ToDo!</Text>
              <View style={styles.modal} >
              <View style={styles.datepicker}>
              <Pressable onPress={showDatepicker} ><FontAwesome name="calendar" size={40} color="#ffba08" /></Pressable>
              {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate;
                  setShow(false);
                  setDate(currentDate);
                }}
              />
              )}
              </View>
              <View style={styles.input}>
              <TextInput
                onSubmitEditing={addToDo}
                onChangeText={onChangeText}
                returnKeyType="done"
                defaultValue={text}
                placeholder="Write ToDo"
              />
              </View>
              </View>
              <Pressable 
              onPress={addToDo}
              style={styles.button}
              ><Text style={{color:"white", fontSize: 20}}>Enter</Text></Pressable>
              </View>
          </Modal>
    )
}

const styles = StyleSheet.create({
    shadow: {
      backgroundColor: "grey",
      opacity:0.6,
      width: "100%",
      height: "100%",
      position: "absolute"
    },
    main : {
      backgroundColor : "#f8f9fa",
      borderRadius: 30,
      width: "90%",
      margin: "5%",
      paddingTop: 45,
      paddingBottom: 45,
      paddingHorizontal: 20,
      alignItems: "center",
      position:"absolute",
      top: "25%",
      elevation: 5,
    },
    modal: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    mainText: {
      fontSize: 30,
      color: "grey",
      elevation: 5,
    },
    input: {
      width: "70%",
      backgroundColor: "white",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 30,
      marginVertical: 20,
      marginRight : 20,
      fontSize: 18,
      elevation: 5,
    },
    datepicker: {
      width: "30%",
      padding: 20,
    },
    button:{
      backgroundColor:"#ffba08",
      borderRadius: 30,
      paddingTop: 5,
      paddingBottom: 5,
      paddingHorizontal: 20,
      elevation: 5,
    },
  });