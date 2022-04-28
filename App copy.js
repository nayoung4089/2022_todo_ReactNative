import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, ScrollView, Pressable, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import TodoInput from "./TodoInput";
import { Fontisto, AntDesign } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [calendar, setCalendar] = useState(false);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [newPop, setNewPop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    loadToDos();
  }, []);
  const getTodo = () => {
    setCalendar(false);
  }
  const getCalendar = () => {
    setCalendar(true);
  }
  const onChangeText = (payload) => setText(payload); // input을 위한 장치
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, edit:false, date , calendar},
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
    setNewPop(!newPop);
    console.log(toDos);
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete ToDo", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  const finishToDo = (key) => {
    Alert.alert("Finish Todo", "Really?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
          Alert.alert("Congratulations!","You Did it!", [{text: "Enter"}])
        },
      },
    ]);
  };
  const editToDo = async (key) => {
    let newToDos = {
      ...toDos,
      [Date.now()]: { "id":Date.now(), text, edit:false, date , calendar},
    };
    newToDos = Object.values(newToDos).filter(item => item.edit === false); // Object.values 안쓰면 안됨..ㅅㅂ
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
    setVisible(!visible);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
      <Pressable onPress={getTodo}>
          <Text style={{ ...styles.btnText, color: calendar ? "grey" : "white" }}>
            Todo
          </Text>
        </Pressable>
        <Pressable onPress={getCalendar}>
          <Text style={{...styles.btnText, color: !calendar ? "grey" : "white"}}>
            Memo
          </Text>
        </Pressable>
      </View>
      <View>
        <TodoInput 
        addToDo={addToDo}
        onChangeText = {onChangeText}
        text = {text}
        visible={newPop}
        toggle={() => {
          setNewPop(!newPop)
        }}
        date={date}
        setDate={setDate}
        />
        <ScrollView>
          {toDos != null ? 
            Object.keys(toDos).map((key) =>
              toDos[key].calendar === calendar ? (
                <View>
                <TodoInput 
                addToDo={editToDo}
                onChangeText = {onChangeText}
                text = {toDos[key].text}
                visible={visible == true ? toDos[key].edit : false} // visible이 true인 경우 모든 팝업이 뜨지 않게 edit=true만 보여준다
                toggle={() => {
                  toDos[key] = {...toDos[key], edit: false};
                  setVisible(!visible);
                  console.log(toDos);
                }}
                date={date}
                setDate={setDate}
                />
              <Pressable
              onLongPress={()=> {
                toDos[key] = {...toDos[key], edit: true};
                setVisible(!visible);
                console.log(toDos)}}
              style={styles.toDo}
              key={key}
              >                
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                {toDos[key].date ? 
                <Text style={styles.toDoText}>D {-Math.ceil((new Date(`${toDos[key].date}`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</Text>
                : null}
                    <Pressable onPress={() => finishToDo(key)}>
                      <AntDesign name="checkcircleo" size={18} color="white" />
                    </Pressable>
                    <Pressable onPress={() => deleteToDo(key)}>
                      <Fontisto name="trash" size={18} color="white" />
                    </Pressable>
              </Pressable>
              </View>
              ) : null ) : null}
        </ScrollView>
      </View>
      <Pressable onPress={() => setNewPop(true)}>
        <AntDesign name="pluscircle" size={60} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  toDo: {
    backgroundColor: "pink",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});