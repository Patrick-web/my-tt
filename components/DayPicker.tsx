import React from 'react'
import { Pressable, View,Text } from 'react-native'

export const DayPicker = ({selectedDay,activeDay} : {selectedDay: Function,activeDay: string}) => {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  return (
  <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'center',width:'100%', backgroundColor:"#0D0D0D" ,paddingTop:10}}>
    {
        days.map(day=>(
            <Pressable onPress={()=>selectedDay(day.toLowerCase())} key={day} 
            style={{
              backgroundColor:activeDay.toLowerCase()==day.toLowerCase()?'white':'#1C1C1C',
              margin:5,
              width:"30%",
              alignItems:'center',
              justifyContent:'center',
              paddingVertical:10,
              paddingHorizontal:10,
              borderRadius:activeDay.toLowerCase()==day.toLowerCase()?30:15
              }}>
              <Text style={{
                fontSize:15, 
                color:activeDay.toLowerCase()==day.toLowerCase()?'black':'white',
                fontWeight:activeDay.toLowerCase()==day.toLowerCase()?'900':'300'
              }}>{day}</Text>
            </Pressable>
        ))
      }
  </View>
  )
}
