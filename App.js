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
  const [finish, setFinish] = useState(false);

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
  const getFinished = (current) => {setFinish(!current);}; // finish하면 style 바꿔주기

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
      [Date.now()]: { text, edit:false, date , calendar, finish},
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

  const editToDo = async (key) => {
    let newToDos = {
      ...toDos,
      [Date.now()]: { "id":Date.now(), text, edit:false, date , calendar, finish},
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
          <Text style={{ ...styles.btnText, color: calendar ? "#faedcd" : "#e85d04" }}>
            Todo
          </Text>
        </Pressable>
        <Pressable onPress={getCalendar}>
          <Text style={{...styles.btnText, color: !calendar ? "#faedcd" : "#e85d04"}}>
            Goal
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
        <ScrollView style={{maxHeight: 433,}}>
          {toDos != null ? 
            Object.keys(toDos).map((key) =>
              toDos[key].calendar === calendar ? (
                <View>
                <TodoInput 
                addToDo={editToDo}
                onChangeText = {onChangeText}
                text = {`${toDos[key].text} (수정)`} // 방법 찾아보기.. 안되면 말구.
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
              style={{... styles.toDo, opacity: toDos[key].finish ? 0.5 : null}}
              key={key}
              onPress={() => {
                getFinished(finish); 
                toDos[key] = {...toDos[key], "finish":!finish};
                }} 
              >                
                <Text style={toDos[key].finish == true? styles.finishTodo : styles.toDoText}>{toDos[key].text}</Text>
                <View style={styles.restText}>
                  {toDos[key].date ? 
                    Math.ceil((new Date(`${toDos[key].date}`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) == 0 ?                 
                    <View style={styles.dDay}><Text style={{...styles.rests, textAlign:"center", color:"white"}}>D-Day</Text></View> :
                    Math.ceil((new Date(`${toDos[key].date}`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) > 0 ?
                    <Text style={styles.rests}>D{-Math.ceil((new Date(`${toDos[key].date}`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</Text> :
                  <Text style={styles.rests}>D+{-Math.ceil((new Date(`${toDos[key].date}`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</Text>
                  : null}
                  <Pressable onPress={() => {
                    getFinished(finish); 
                    toDos[key] = {...toDos[key], "finish":!finish};
                    }} 
                    style={styles.rests}>
                    <AntDesign name="checkcircleo" size={22} color="white" />
                  </Pressable>
                  <Pressable onPress={() => deleteToDo(key)} style={styles.rests}>
                    <Fontisto name="trash" size={22} color="white" />
                  </Pressable>
                </View>
              </Pressable>
              </View>
              ) : null ) : null}
        </ScrollView>
      </View>
      <Pressable onPress={() => setNewPop(true)} style={styles.plus}>
        <Text style={{color:"white", fontSize:45, textAlign: "center", fontWeight:"900"}}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
    paddingBottom: 30,
    paddingTop:10,
    paddingHorizontal:30,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "800",
  },
  toDo: {
    backgroundColor: "#faa307",
    elevation: 7, // 그림자
    marginBottom: 10,
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  finishTodo : {
    fontSize: 12,
    opacity: 0.6,
    color: "#f8f9fa",
    textDecorationLine:"line-through",
  },
  dDay:{
    backgroundColor:"#e85d04",
    borderRadius: 30,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  restText : {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  rests: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  plus: {
    width: 65,
    height: 65,
    borderRadius: 100,
    backgroundColor:"#ffba08",
    position:"absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
  }
});