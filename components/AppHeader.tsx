import { useEffect, useState } from 'react';
import { View, Dimensions,Image,Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

export const AppHeader = ({selectedDay,activeDay} : {selectedDay: string,activeDay:string}) => {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const headerHeight = Math.trunc(windowHeight/1/5);
  const [headerImage,setHeaderImage] = useState<string>("https://images.unsplash.com/photo-1651841366853-ef8c51dae31b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=360&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1Mzk5OTQ4NA&ixlib=rb-1.2.1&q=80&w=1028");
  const [headerImages,setHeaderImages] = useState<string[]>(["https://images.unsplash.com/photo-1651841366853-ef8c51dae31b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=360&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1Mzk5OTQ4NA&ixlib=rb-1.2.1&q=80&w=1028"])
  const [currentImageIndex,setCurrentImageIndex] = useState<number>(0);
  const getRandomImage = async () => {
    const categories = ['city','landscape','neon','past','morning','sunset'];
    const randomCategory = categories[Math.floor((Math.random()*categories.length))]
    const url = `https://source.unsplash.com/random/${windowWidth+400}x${headerHeight+400}?${randomCategory}`
    const images: any = []
    categories.forEach(i=>{
      fetch(url).then(resp=>{
        images.push(resp.url)
      })
    })
    setHeaderImages(images) 
  };
  useEffect(()=>{
    setHeaderImage(headerImages[currentImageIndex])
    setCurrentImageIndex((currentImageIndex+1)>headerImages.length-1?0:currentImageIndex+1)
  },[activeDay])
  useEffect(()=>{
    getRandomImage()
    setHeaderImage(headerImages[currentImageIndex])
    setCurrentImageIndex((currentImageIndex+1)>headerImages.length-1?0:currentImageIndex+1)
  },[])
  return (
  <View style={{height:headerHeight}}>
      <Image source={{uri:headerImage}} style={{height:'100%',width:windowWidth}} /> 
      <View style={{position:'absolute',bottom:0,left:0,right:0,padding:10}}>
       <LinearGradient
        // Background Linear Gradient
        colors={['transparent','rgba(0,0,0,0.8)']}
        style={{position:'absolute',top:0,left:0,bottom:0,right:0}}
      />
      <Text style={{color:'white',fontSize:30, fontWeight:'900'}}>{selectedDay.charAt(0).toUpperCase()+selectedDay.slice(1)}</Text>
      </View>
  </View>
  )
}
