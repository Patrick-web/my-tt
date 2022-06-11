import { useEffect,useState } from 'react';
import { View,Text,Pressable } from 'react-native'
import {User, MapPin, Trash, Edit2} from "react-native-feather"
import Svg, {Path} from 'react-native-svg';

export const LessonCard = ({lesson,openEditForm,openDeleteConfirmation,index,keyy} : {lesson: any,index:number,openDeleteConfirmation: Function,openEditForm: Function,keyy:any}) => {
  const [showActions,setShowActions] = useState(false)
  return (
  <View style={{margin:10,paddingLeft:28}} key={keyy}>
  <Svg style={{position:'absolute',top:12,left:0,bottom:0}} width="28" height="85%" viewBox="0 0 28 172" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M26 2.75H12.5C6.97715 2.75 2.5 7.22715 2.5 12.75V160C2.5 165.523 6.97715 170 12.5 170H23" stroke="white" strokeWidth={4} strokeLinecap="round" stroke-linejoin="round"/>
  </Svg>

    <Text style={{color:'white', fontSize:20, fontWeight:'700'}}>{lesson.startTime}</Text>
      <View style={{borderRadius:10,backgroundColor:'#252525', marginVertical:5}}>
        <Text style={{color:'white',fontWeight:'600',paddingVertical:5,paddingHorizontal:10,fontSize:15,backgroundColor:'#1F1F1F',borderTopLeftRadius:10,borderTopRightRadius:10}}>{lesson.title}</Text>
        <Pressable onPress={()=>setShowActions(!showActions)} style={{paddingVertical:5,paddingHorizontal:10,}}>
          <View style={{flexDirection:'row', alignItems:'center',marginBottom:5}}>
            <User stroke="white" width={13} height={13}/>
            <Text style={{marginLeft:5,fontSize:13,fontWeight:'300',color:'white'}}>{lesson.lecturer}</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center',marginBottom:5}}>
            <MapPin stroke="white" width={13} height={13}/>
            <Text style={{marginLeft:5,fontSize:13,fontWeight:'300',color:'white'}}>{lesson.venue}</Text>
          </View>
        </Pressable>
        {
        showActions &&
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center',position:'absolute',bottom:-18,right:10,backgroundColor:'#1F1F1F', padding:5,borderRadius:30}}>
          <Pressable onPress={()=>openDeleteConfirmation(index)} style={{backgroundColor:'white', alignSelf:'flex-start',padding:10,marginRight:8,width:35,height:35,alignItems:'center',justifyContent:'center',borderRadius:30}}>
          <Trash stroke="black" width={13} height={13}/>
          </Pressable>
          <Pressable onPress={()=>openEditForm(lesson,index)} style={{backgroundColor:'white', alignSelf:'flex-start',padding:10,width:35,height:35,alignItems:'center',justifyContent:'center',borderRadius:30}}>
          <Edit2 stroke="black" width={13} height={13}/>
          </Pressable>
        </View>
        }
      </View>
    <Text style={{color:'white', fontSize:20, fontWeight:'700'}}>{lesson.endTime}</Text>
  </View>
  )
}
