import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  Button,
  Pressable,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from "@expo/vector-icons";

export default function Daily({addToDo, onChangeText, text, visible, toggle, date, setDate, multiline}){
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
            style={styles.modal} 
            onRequestClose={toggle}>
              <Pressable onPress={showDatepicker}><FontAwesome name="calendar" size={24} color="white" /></Pressable>
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
              <TextInput
                onSubmitEditing={addToDo}
                onChangeText={onChangeText}
                returnKeyType="done"
                defaultValue={text}
                placeholder="Write ToDo"
                style={styles.input}
                multiline={multiline}
              />
          </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
      backgroundColor: "white",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 30,
      marginVertical: 20,
      fontSize: 18,
    },
  });