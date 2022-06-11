import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage  from "@react-native-async-storage/async-storage"
import { BottomSheet } from 'react-native-btr';
import {Plus} from "react-native-feather"
import {  StyleSheet,Dimensions ,Text, View,Pressable,Image, ScrollView, TextInput } from 'react-native';
import { AppHeader } from './components/AppHeader';
import { DayPicker } from './components/DayPicker';
import { LessonCard } from './components/LessonCard';
import { LessonAddForm } from './components/LessonAddForm';
import { LessonEditForm } from './components/LessonEditForm';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function App() {

  const [selectedDay,setSelectedDay] = useState('monday')
  const [allLessons,setAllLessons] = useState<any>(null)
  const [selectedDayLessons,setDayLessons] = useState([])

  const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false)
  
  const [lessonToEdit,setLessonToEdit] = useState<any>(null)
  const [lessonEditIndex, setLessonEditIndex] = useState<number>(0)

  const [showLessonAddForm,setShowLessonAddForm] = useState(false)
  const [showLessonEditForm,setShowLessonEditForm] = useState(false)

  function addLesson(newLesson: any){
      const currentLessons = allLessons.get(selectedDay).classes
      currentLessons.push(newLesson)
      allLessons.get(selectedDay).classes = currentLessons;
      console.log(allLessons)
      setDayLessons(allLessons.get(selectedDay).classes)
      AsyncStorage.setItem('allLessons',JSON.stringify([...allLessons])).then(()=>{
        console.log("Saved")
        setShowEditPane(false)
      }).catch((err)=>{
          console.log(err)
      })
    }

  function openEditForm(lesson: any,index: number){
    console.log(lesson)
    console.log(index)
    setLessonToEdit(lesson) 
    setLessonEditIndex(index)    
    setShowLessonEditForm(true)
  }
  function saveEditedLesson(editedLesson: any){
    allLessons.get(selectedDay).classes[lessonEditIndex]=editedLesson
    console.log(allLessons.get(selectedDay).classes[lessonEditIndex])
    setDayLessons(allLessons.get(selectedDay).classes)
    AsyncStorage.setItem('allLessons',JSON.stringify([...allLessons])).then(()=>{
      console.log("Edited Lesson Saved")
    }).catch((err)=>{
        console.log(err)
    }).finally(()=>{
      setShowLessonEditForm(false)
    })
  }
  
  function openDeleteConfirmation(index: number){
    setLessonEditIndex(index)    
    setShowDeleteConfirmation(true)
  }

  function deleteLesson(){
    allLessons.get(selectedDay).classes.splice(lessonEditIndex,1)
    console.log(allLessons.get(selectedDay).classes)
    setDayLessons(allLessons.get(selectedDay).classes)
    AsyncStorage.setItem('allLessons',JSON.stringify([...allLessons])).then(()=>{
      console.log("Saved")
      setShowDeleteConfirmation(false)
    }).catch((err)=>{
        console.log(err)
    })
  }



  useEffect(()=>{
      AsyncStorage.getItem("allLessons").then(data=>{
        const dbAllLessons: any = data?new Map(JSON.parse(data)):null
          setAllLessons(dbAllLessons)
            setDayLessons(dbAllLessons.get(selectedDay).classes)
            console.log(allLessons)
            console.log("-=-Set+++")
            console.log(selectedDayLessons)
            console.log("-=-===++++")
      })
      .catch((err)=>{
          console.log("Error getting from local storage")
        console.log(err)
        })
    },[])
  
  return (
    <View style={{flex:1,backgroundColor:'black'}}>
      <StatusBar style="auto" />
      <Pressable onPress={()=>{setShowLessonAddForm(true)}} style={styles.addLessonBtn}>
        <Plus stroke="black"/>
      </Pressable>
      <AppHeader selectedDay={selectedDay} activeDay={selectedDay} />

        
        <LessonAddForm 
        showForm={showLessonAddForm} 
        hideForm={()=>setShowLessonAddForm(false)} 
        addLesson={addLesson} />
        {
          lessonToEdit && 
          <LessonEditForm 
          showForm={showLessonEditForm} 
          selectedLesson={lessonToEdit} 
          hideForm={()=>setShowLessonEditForm(false)} 
          saveEditedLesson={saveEditedLesson}  />
        }
        <BottomSheet
          visible={showDeleteConfirmation}
          onBackButtonPress={()=>setShowDeleteConfirmation(false)}
          onBackdropPress={()=>setShowDeleteConfirmation(false)}
        >
        <View style={{padding:10,borderTopRightRadius:20,borderTopLeftRadius:20,backgroundColor:'#252525',width:"100%"}}>
         <Text style={{textAlign:'center',marginBottom:8 ,fontSize:25,fontWeight:'900', color:'white'}}>Delete This Lesson ?</Text>
         <Pressable onPress={deleteLesson} style={{backgroundColor:'crimson', padding:10,margin:3,alignItems:'center',borderRadius:10}}>
            <Text style={{color:'white',fontWeight:'800',fontSize:17}}>Yes</Text>
         </Pressable>
        </View>
        </BottomSheet>

      <ScrollView style={{height:windowHeight/2,width:'100%'}}>
      { 
        selectedDayLessons
        .map((lesson: any, index: number)=>
        <LessonCard 
        lesson={lesson} 
        index={index} 
        openDeleteConfirmation={openDeleteConfirmation} 
        openEditForm={openEditForm} 
        keyy={index}/>) 
      }
      { 
        !selectedDayLessons && 
        <View><Text style={{color:'white'}}>Nothing Loaded</Text></View>
      }
      { 
        selectedDayLessons.length==0 &&
        <View style={{alignItems:'center',justifyContent:'center', height:300}}>
        <Image source={require("./assets/celebrate.png")} style={{marginBottom:10, width:150,height:150}} />
        <Text style={{color:'white', fontSize:25}}>No Lessons</Text></View>
      }
      </ScrollView>
      <DayPicker activeDay={selectedDay} setSelectedDay={setSelectedDay} />
    </View>
  );
}

const styles = StyleSheet.create({
  addLessonBtn: {
      position:'absolute',
      zIndex:2,
      bottom:120,
      left:(windowWidth/2) - 40,
      overflow:'hidden',
      alignItems:'center',
      justifyContent:'center',
      paddingTop:0,
      width:80,
      height:80,
      borderRadius:40,
      backgroundColor:'white',
    },
});
