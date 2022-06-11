import {useState} from "react"
import {StyleSheet,Dimensions,View,Text,TextInput,Pressable} from "react-native"
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BottomSheet } from 'react-native-btr';


export const LessonEditForm = ({selectedLesson,saveEditedLesson, showForm, hideForm} : {selectedLesson: any,showForm: boolean,hideForm: Function,saveEditedLesson: Function}) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [pickerFor, setPickerFor] = useState<'startTime'|'endTime' | null >(null);

  const [lessonStartTime, setStartTime] = useState(selectedLesson.startTime)
  const [lessonEndTime, setEndTime] = useState(selectedLesson.endTime)
  const [lessonLecturer,setLecturer] = useState(selectedLesson.lecturer);
  const [lessonUnitCode,setUnitCode] = useState(selectedLesson.code);
  const [lessonUnitName,setUnitName] = useState(selectedLesson.title);
  const [lessonVenue,setVenue] = useState(selectedLesson.venue);


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

  const onPickDate = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if(selectedDate == undefined) return
    setPickerFor(null)
    const time = formatAMPM(selectedDate);
    if(pickerFor=='startTime'){
      setStartTime(time)
    }else{
      setEndTime(time)
    }
  };

  function createEditedLesson(){
      const editedLesson = {
          startTime: lessonStartTime,
          endTime: lessonEndTime,
          venue: lessonVenue,
          code: lessonUnitCode,
          title: lessonUnitName,
          lecturer: lessonLecturer,
      }
      saveEditedLesson(editedLesson)
      clearEditForm()
  }

  function clearEditForm(){
    setStartTime("")
    setEndTime("")
    setLecturer("")
    setUnitCode("")
    setUnitName("")
    setVenue("")
   }

  return (
        <BottomSheet
          visible={showForm}
          onBackButtonPress={hideForm}
          onBackdropPress={hideForm}
        >
          <View style={{height:430,padding:10,borderTopRightRadius:20,borderTopLeftRadius:20,backgroundColor:'#252525',width:"100%"}}>
            <Text style={{textAlign:'center',marginBottom:8 ,fontSize:25,fontWeight:'900', color:'white'}}>Edit Lesson</Text>
            {
              pickerFor &&
             <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"time"}
                is24Hour={true}
                onChange={onPickDate}
              />
            }

            <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
              <View style={{alignItems:'center',justifyContent:'center',marginRight:10}}>
                <Pressable onPress={()=>setPickerFor('startTime')} style={styles.timeBtn}>
                  <Text style={{color:'white',fontWeight:'900'}}>Start Time</Text>
                </Pressable>
                <Text style={{color:'white'}}> {lessonStartTime} </Text>
              </View>
              <View style={{alignItems:'center',justifyContent:'center'}}>
                <Pressable onPress={()=>setPickerFor('endTime')} style={styles.timeBtn}>
                  <Text style={{color:'white',fontWeight:'900'}}>End Time</Text>
                </Pressable>
                <Text style={{color:'white'}}> {lessonEndTime} </Text>
              </View>
            </View>
            <View style={{marginBottom:8}}>
              <Text style={styles.tLabel}>Lecturer</Text>
              <TextInput value={lessonLecturer} onChangeText={(text)=>setLecturer(text)} style={styles.tInput}/>
            </View>

            <View style={{marginBottom:8}}>
              <Text style={styles.tLabel}>Unit Code</Text>
              <TextInput  value={lessonUnitCode} onChangeText={(text)=>setUnitCode(text)}style={styles.tInput}/>
            </View>
            <View style={{marginBottom:8}}>
              <Text style={styles.tLabel}>Unit Name</Text>
              <TextInput  value={lessonUnitName} onChangeText={(text)=>setUnitName(text)} style={styles.tInput}/>
            </View>
            <View style={{marginBottom:8}}>
              <Text style={styles.tLabel}>Venue</Text>
              <TextInput  value={lessonVenue} onChangeText={(text)=>setVenue(text)} style={styles.tInput}/>
            </View>
          
            <Pressable onPress={createEditedLesson} style={{backgroundColor:'white', padding:10,margin:3,alignItems:'center',borderRadius:10}}>
              <Text style={{color:'black',fontWeight:'800',fontSize:17}}>Save Changes</Text>
            </Pressable>
          </View>
        </BottomSheet>
  )
}
const styles = StyleSheet.create({
    timeBtn:{
      backgroundColor:'#1F1F1F',
      padding:9,
      borderRadius:20,
      width:100, 
      alignItems:'center',
      justifyContent:'center',
    },
    tInput: {
        backgroundColor:'#1F1F1F',
        color:'white',
        padding:5,
        paddingTop:10,
        paddingLeft:10,
        borderRadius:10,
    },
    tLabel: {
        backgroundColor:'#1A1A1A',
        color:'white',
        alignSelf:'flex-start',
        paddingHorizontal:8,
        paddingVertical:4,
        borderRadius:8,
        marginBottom:-12,
        zIndex:2,
    },
});
