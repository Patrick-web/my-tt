import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage  from "@react-native-async-storage/async-storage"
import { BottomSheet } from 'react-native-btr';
import {  StyleSheet,Dimensions ,Text, View,Pressable,Image, ScrollView, TextInput } from 'react-native';
import Svg, {Path} from 'react-native-svg';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppHeader } from './components/AppHeader';
import { DayPicker } from './components/DayPicker';
import { LessonCard } from './components/LessonCard';
import * as Papa from "papaparse"

export default function App() {

  const windowHeight = Dimensions.get('window').height;
  const [selectedDay,setSelectedDay] = useState('monday')
  const [allLessons,setAllLessons] = useState(new Map)
  const [selectedDayLessons,setDayLessons] = useState([])

  const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false)

  const [showEditPane, setShowEditPane] = useState(false); 
  const [formMode,setFormMode] = useState<'edit' | 'create'>('create')
  const [lessonEditIndex, setLessonEditIndex] = useState<number>(0)

  const [lessonStartTime, setStartTime] = useState("8:00 am")
  const [lessonEndTime, setEndTime] = useState("10:00 am")
  const [lessonLecturer,setLecturer] = useState("");
  const [lessonUnitCode,setUnitCode] = useState("");
  const [lessonUnitName,setUnitName] = useState("");
  const [lessonVenue,setVenue] = useState("");

  const [date, setDate] = useState(new Date(1598051730000));
  const [pickerFor, setPickerFor] = useState<'startTime'|'endTime' | null >(null);

  const onChange = (event: any, selectedDate: Date) => {
    setPickerFor(null)
    const time = formatAMPM(selectedDate);
    if(pickerFor=='startTime'){
      setStartTime(time)
    }else{
      setEndTime(time)
    }
  };
  
  function formatAMPM(date: Date) {
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let ampm: any = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  function openDocumentPicker(){
      DocumentPicker.getDocumentAsync({type:'text/csv'}).then((result: DocumentPicker.DocumentResult)=>{
        const file = result as any
        if(file?.uri as any){
          FileSystem.readAsStringAsync(file.uri).then(result=>{
              const data = Papa.parse(result)
              parseCSVData(data.data)
            })
        }
      })
    }

  function addLesson(){
      const newLesson = {
          startTime: lessonStartTime,
          endTime: lessonEndTime,
          venue: lessonVenue,
          code: lessonUnitCode,
          title: lessonUnitName,
          lecturer: lessonLecturer,
        }
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
    clearEditForm()
    }

  function openEditForm(lesson: any,index: number){
    console.log(lesson)
    console.log(index)
    
    setStartTime(lesson.startTime)
    setEndTime(lesson.endTime)
    setLecturer(lesson.lecturer)
    setUnitCode(lesson.code)
    setUnitName(lesson.title)
    setVenue(lesson.venue)

    setFormMode('edit')
    setShowEditPane(true)
    setLessonEditIndex(index)    
  }
  function saveEditedLesson(){
    const editedLesson = {
      startTime: lessonStartTime,
      endTime: lessonEndTime,
      venue: lessonVenue,
      code: lessonUnitCode,
      title: lessonUnitName,
      lecturer: lessonLecturer,
    }
    allLessons.get(selectedDay).classes[lessonEditIndex]=editedLesson
    console.log(allLessons.get(selectedDay).classes[lessonEditIndex])
    setDayLessons(allLessons.get(selectedDay).classes)
    AsyncStorage.setItem('allLessons',JSON.stringify([...allLessons])).then(()=>{
      console.log("Saved")
      setShowEditPane(false)
    }).catch((err)=>{
        console.log(err)
    })
    clearEditForm()
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

  function clearEditForm(){
    setStartTime("")
    setEndTime("")
    setLecturer("")
    setUnitCode("")
    setUnitName("")
    setVenue("")
   }

  function parseCSVData(data: any[]){
    const classes = new Map()
    const units = new Map()
    const unitRows = [data[40],data[41],data[42],data[43],data[44]]

    unitRows.forEach((row: any[])=>{
      const unit ={
        code: row[0].trim(),
        title: row[1].trim(),
        lecturer: row[5].trim()
      }
      units.set(unit.code,{...unit})
    })

    const lessonRows: any[] = [data[10],data[13],data[16],data[19],data[22]]
    lessonRows.forEach(row=>{
      const rowClasses: any[] = row.filter((i:any)=>i.includes("CCS"))
      let classesInfo = rowClasses.map((cls:any)=>{
        const unitCode = cls.split('(')[0].trim();
        const venue = cls.match(/\(.*\)/)[0].replace(/\(|\)/g,"");
        
        const index = row.findIndex((x: any)=>x==cls)
        const startTime = index + 5;
        const endTime = venue.includes('RCL')?startTime+3:startTime+2;

        return {
              venue,
              startTime: startTime > 12 ? ((startTime-12)+":00 pm") : (startTime+":00 am"),
              endTime: endTime > 12 ? ((endTime-12)+":00 pm") : (endTime+":00 am"),
              ...units.get(unitCode)
          }
      });
      classes.set(row[0].toLowerCase(),{classes: classesInfo})
    })
    setAllLessons(classes) 
    console.log(classes)
    AsyncStorage.setItem('allLessons',JSON.stringify([...classes])).then(()=>{
        console.log("Saved")
      }).catch((err)=>{
          console.log(err)
        })
   console.log(classes) 
  }

  useEffect(()=>{
      AsyncStorage.getItem("allLessons").then(data=>{
        const allLessons = data?new Map(JSON.parse(data)):null
        if(allLessons){
            setAllLessons(allLessons)
        console.log("-=-Set+++")
          }
        console.log("-=-===++++")
      })
      .catch((err)=>{
          console.log("Error getting from local storage")
        console.log(err)
        })
    },[])
  useEffect(()=>{
      if(allLessons && allLessons.get(selectedDay)){
        setDayLessons(allLessons.get(selectedDay).classes)
      }else{
          setDayLessons([])
        }
    },[selectedDay])
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Pressable onPress={openDocumentPicker} style={{position:'absolute', zIndex:2,bottom:120,right:0,overflow:'hidden',alignItems:'center',justifyContent:'center',paddingTop:0,width:60,height:50,borderTopLeftRadius:40,borderTopRightRadius:40,backgroundColor:'#0D0D0D'}}>
        <Svg width="15" height="21" viewBox="0 0 27 33" fill="none">
          <Path d="M16.3765 1.71454H4.37646C3.58082 1.71454 2.81775 2.03061 2.25514 2.59322C1.69254 3.15583 1.37646 3.91889 1.37646 4.71454V28.7145C1.37646 29.5102 1.69254 30.2732 2.25514 30.8359C2.81775 31.3985 3.58082 31.7145 4.37646 31.7145H22.3765C23.1721 31.7145 23.9352 31.3985 24.4978 30.8359C25.0604 30.2732 25.3765 29.5102 25.3765 28.7145V10.7145L16.3765 1.71454Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M16.3765 1.71454V10.7145H25.3765" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M13.3765 25.7145V16.7145" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M8.87646 21.2145H17.8765" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      </Pressable>
      <Pressable onPress={()=>{setShowEditPane(true); setFormMode('create')}} style={{position:'absolute', zIndex:2,bottom:120,right:70,overflow:'hidden',alignItems:'center',justifyContent:'center',paddingTop:0,width:60,height:50,borderTopLeftRadius:40,borderTopRightRadius:40,backgroundColor:'#0D0D0D'}}>
        <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <Path d="M11 7V15M7 11H15M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      </Pressable>
      <AppHeader selectedDay={selectedDay} activeDay={selectedDay} />

        <BottomSheet
          visible={showEditPane}
          onBackButtonPress={()=>setShowEditPane(!showEditPane)}
          onBackdropPress={()=>setShowEditPane(!showEditPane)}
        >
          <View style={{height:430,padding:10,borderTopRightRadius:20,borderTopLeftRadius:20,backgroundColor:'#252525',width:"100%"}}>
              {formMode=='create'?<Text style={{textAlign:'center',marginBottom:8 ,fontSize:25,fontWeight:'900', color:'white'}}>Add Lesson</Text>:
              <Text style={{textAlign:'center',marginBottom:8 ,fontSize:25,fontWeight:'900', color:'white'}}>Edit Lesson</Text>}
            {
              pickerFor &&
             <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"time"}
                is24Hour={true}
                onChange={onChange}
              />
            }

            <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
              <View style={{alignItems:'center',justifyContent:'center',marginRight:10}}>
                <Pressable onPress={()=>setPickerFor('startTime')} style={{backgroundColor:'#1F1F1F',padding:9, borderRadius:20, width:100, alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:'white',fontWeight:'900'}}>Start Time</Text>
                </Pressable>
                <Text style={{color:'white'}}> {lessonStartTime} </Text>
              </View>
              <View style={{alignItems:'center',justifyContent:'center'}}>
                <Pressable onPress={()=>setPickerFor('endTime')} style={{backgroundColor:'#1F1F1F',padding:9, borderRadius:20, width:100, alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:'white',fontWeight:'900'}}>End Time</Text>
                </Pressable>
                <Text style={{color:'white'}}> {lessonEndTime} </Text>
              </View>
            </View>
            <View style={{marginBottom:8}}>
              <Text style={{backgroundColor:'#1A1A1A',color:'white',alignSelf:'flex-start',paddingHorizontal:8,paddingVertical:4,borderRadius:8,marginBottom:-12,zIndex:2}}>Lecturer</Text>
              <TextInput value={lessonLecturer} onChangeText={(text)=>setLecturer(text)} style={{backgroundColor:'#1F1F1F',color:'white' ,padding:5, paddingTop:10,paddingLeft:10,borderRadius:10}}/>
            </View>

            <View style={{marginBottom:8}}>
              <Text style={{backgroundColor:'#1A1A1A',color:'white',alignSelf:'flex-start',paddingHorizontal:8,paddingVertical:4,borderRadius:8,marginBottom:-12,zIndex:2}}>Unit Code</Text>
              <TextInput  value={lessonUnitCode} onChangeText={(text)=>setUnitCode(text)}style={{backgroundColor:'#1F1F1F',color:'white' ,padding:5, paddingTop:10,paddingLeft:10,borderRadius:10}}/>
            </View>
            <View style={{marginBottom:8}}>
              <Text style={{backgroundColor:'#1A1A1A',color:'white',alignSelf:'flex-start',paddingHorizontal:8,paddingVertical:4,borderRadius:8,marginBottom:-12,zIndex:2}}>Unit Name</Text>
              <TextInput  value={lessonUnitName} onChangeText={(text)=>setUnitName(text)} style={{backgroundColor:'#1F1F1F',color:'white' ,padding:5, paddingTop:10,paddingLeft:10,borderRadius:10}}/>
            </View>
            <View style={{marginBottom:8}}>
              <Text style={{backgroundColor:'#1A1A1A',color:'white',alignSelf:'flex-start',paddingHorizontal:8,paddingVertical:4,borderRadius:8,marginBottom:-12,zIndex:2}}>Venue</Text>
              <TextInput  value={lessonVenue} onChangeText={(text)=>setVenue(text)} style={{backgroundColor:'#1F1F1F',color:'white' ,padding:5, paddingTop:10,paddingLeft:10,borderRadius:10}}/>
            </View>
          { formMode=='create' ? 
            <Pressable onPress={addLesson} style={{backgroundColor:'white', padding:10,margin:3,alignItems:'center',borderRadius:10}}>
              <Text style={{color:'black',fontWeight:'800',fontSize:17}}>Add</Text>
            </Pressable>

            :<Pressable onPress={saveEditedLesson} style={{backgroundColor:'white', padding:10,margin:3,alignItems:'center',borderRadius:10}}>
              <Text style={{color:'black',fontWeight:'800',fontSize:17}}>Save Changes</Text>
            </Pressable>
          }

          </View>
        </BottomSheet>

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

      <ScrollView style={{height:windowHeight/3,width:'100%'}}>
      { selectedDayLessons.map((lesson: any, index: number)=><LessonCard lesson={lesson} index={index} openDeleteConfirmation={openDeleteConfirmation} openEditForm={openEditForm} key={lesson.unitCode}/>) }
      { !selectedDayLessons && <View><Text style={{color:'white'}}>Nothing Loaded</Text></View>}
      { selectedDayLessons.length==0 && <View style={{alignItems:'center',justifyContent:'center', height:300}}>
      <Image source={require("./assets/celebrate.png")} style={{marginBottom:10, width:150,height:150}} />
      <Text style={{color:'white', fontSize:25}}>No Lessons</Text></View>}
      </ScrollView>
      <DayPicker activeDay={selectedDay} selectedDay={setSelectedDay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
});
