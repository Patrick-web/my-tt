import { useEffect,useState } from 'react';
import { View,Text,Pressable } from 'react-native'
import Svg, {Path} from 'react-native-svg';

export const LessonCard = ({lesson,openEditForm,openDeleteConfirmation,index,key} : {lesson: any,index:number,openDeleteConfirmation: Function,openEditForm: Function,key:any}) => {
  const [showActions,setShowActions] = useState(false)
  return (
  <View style={{margin:10,paddingLeft:28}} key={key}>
  <Svg style={{position:'absolute',top:12,left:0,bottom:0}} width="28" height="85%" viewBox="0 0 28 172" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M26 2.75H12.5C6.97715 2.75 2.5 7.22715 2.5 12.75V160C2.5 165.523 6.97715 170 12.5 170H23" stroke="white" strokeWidth={4} strokeLinecap="round" stroke-linejoin="round"/>
  </Svg>

    <Text style={{color:'white', fontSize:20, fontWeight:'700'}}>{lesson.startTime}</Text>
      <View style={{borderRadius:10,backgroundColor:'#252525', marginVertical:5}}>
        <Text style={{color:'white',fontWeight:'600',paddingVertical:5,paddingHorizontal:10,fontSize:15,backgroundColor:'#1F1F1F',borderTopLeftRadius:10,borderTopRightRadius:10}}>{lesson.title}</Text>
        <Pressable onPress={()=>setShowActions(!showActions)} style={{paddingVertical:5,paddingHorizontal:10,}}>
          <View style={{flexDirection:'row', alignItems:'center',marginBottom:5}}>
          <Svg width="13" height="13" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M17.5 19.5V17.5C17.5 16.4391 17.0786 15.4217 16.3284 14.6716C15.5783 13.9214 14.5609 13.5 13.5 13.5H5.5C4.43913 13.5 3.42172 13.9214 2.67157 14.6716C1.92143 15.4217 1.5 16.4391 1.5 17.5V19.5M13.5 5.5C13.5 7.70914 11.7091 9.5 9.5 9.5C7.29086 9.5 5.5 7.70914 5.5 5.5C5.5 3.29086 7.29086 1.5 9.5 1.5C11.7091 1.5 13.5 3.29086 13.5 5.5Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>

            <Text style={{marginLeft:5,fontSize:13,fontWeight:'300',color:'white'}}>{lesson.lecturer}</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center',marginBottom:5}}>

          <Svg width="13" height="13" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12.3183 6.30987C12.3183 10.3889 6.92694 13.8853 6.92694 13.8853C6.92694 13.8853 1.53558 10.3889 1.53558 6.30987C1.53558 4.91893 2.1036 3.58496 3.11467 2.60142C4.12575 1.61788 5.49706 1.06533 6.92694 1.06533C8.35681 1.06533 9.72813 1.61788 10.7392 2.60142C11.7503 3.58496 12.3183 4.91893 12.3183 6.30987Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M6.92698 8.05805C7.9195 8.05805 8.7241 7.27537 8.7241 6.30987C8.7241 5.34438 7.9195 4.5617 6.92698 4.5617C5.93446 4.5617 5.12986 5.34438 5.12986 6.30987C5.12986 7.27537 5.93446 8.05805 6.92698 8.05805Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
            <Text style={{marginLeft:5,fontSize:13,fontWeight:'300',color:'white'}}>{lesson.venue}</Text>
          </View>
        </Pressable>
        {
        showActions &&
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center',position:'absolute',bottom:-18,right:10,backgroundColor:'#1F1F1F', padding:5,borderRadius:30}}>
          <Pressable onPress={()=>openDeleteConfirmation(index)} style={{backgroundColor:'white', alignSelf:'flex-start',padding:10,marginRight:8,width:35,height:35,alignItems:'center',justifyContent:'center',borderRadius:30}}>
          <Svg width="13" height="15" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M1 5H3M3 5H19M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V5H3ZM6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
          </Pressable>
          <Pressable onPress={()=>openEditForm(lesson,index)} style={{backgroundColor:'white', alignSelf:'flex-start',padding:10,width:35,height:35,alignItems:'center',justifyContent:'center',borderRadius:30}}>
            <Svg width="13" height="15" viewBox="0 0 22 22" fill="none">
              <Path d="M16 2C16.2626 1.73736 16.5744 1.52902 16.9176 1.38687C17.2608 1.24473 17.6286 1.17157 18 1.17157C18.3714 1.17157 18.7392 1.24473 19.0824 1.38687C19.4256 1.52902 19.7374 1.73736 20 2C20.2626 2.26264 20.471 2.57445 20.6131 2.91761C20.7553 3.26077 20.8284 3.62857 20.8284 4C20.8284 4.37144 20.7553 4.73923 20.6131 5.08239C20.471 5.42555 20.2626 5.73736 20 6L6.5 19.5L1 21L2.5 15.5L16 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </Pressable>
        </View>
        }
      </View>
    <Text style={{color:'white', fontSize:20, fontWeight:'700'}}>{lesson.endTime}</Text>
  </View>
  )
}
