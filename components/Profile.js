import React, { Component } from 'react'
import {StyleSheet,Text,View,Image} from 'react-native'
import { Container,Header,Content} from 'native-base'
import {AsyncStorage} from 'react-native';
import GradientButton from 'react-native-gradient-buttons';
import { NavigationActions } from 'react-navigation'
import Footer from './MiniComponents/Footer'
import Loader from './MiniComponents/Loader'

import { URL, Colors, ButtonColors } from '../Static'

export default class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user:'',
      avatarUri: 'https://i.imgur.com/bWln98R.jpeg',
      isLoading :true,
    }
    this.logOut = this.logOut.bind(this)
  }
  componentDidMount=()=>  {
    this.fetchData()
  }

  async fetchData(){
    let id = await AsyncStorage.getItem('ID')
    if(id === null) return
    ///////////////////////Fetch user//////////////////////////////////////////
    await fetch(URL + 'user/' + id)
    .then((response) => response.json())
    .then(res => this.setState({
      user:res,
      isLoading : false
    }))
    .catch(function (err) {
      console.log(err)
      return err;
    })
  }

  async logOut(){
     await AsyncStorage.removeItem('ID')
     this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0)
  }
  
  render () {
    if(this.state.isLogged !== null){
      if(this.state.isLoading ) return <Loader/> 
    }
    else return this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Login' })], 0)
      
    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
          <Image style={styles.avatar} source={{uri: this.state.avatarUri }} />
        </Header>

        <Content contentContainerStyle={styles.contentBody}>
            <View style={styles.contentInfo}>
              <Text style={styles.username}>{this.state.user.username}</Text>
              <Text style={styles.email}>{this.state.user.email}</Text>
            </View>

            <View style={styles.contentButtons}>
              <GradientButton
                text="Edit profile"
                textStyle={styles.buttonText}
                style={styles.buttonContainer}
                gradientBegin= {ButtonColors.primary}
                gradientEnd={ButtonColors.second}
                radius={15}
                impact
                onPressAction={()=> this.props.navigation.navigate('EditProfile')}
              />

              <GradientButton
                text="Log out"
                textStyle={styles.buttonText}
                style={styles.buttonContainer}
                gradientBegin= {ButtonColors.primary}
                gradientEnd={ButtonColors.second}
                radius={15}
                impact
                onPressAction={this.logOut}
              />
            </View>
        </Content>

        <Footer/>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors.second
  },
  header:{
    backgroundColor: Colors.primary,
    height: 200
  },
  avatar: {
    width: 175,
    height: 175,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: Colors.primary,
    position: 'absolute',
    marginTop: 55,
  },
  contentBody: {
    flex:1,
    marginTop: '4%',
    alignItems: 'center',
  },
  contentInfo:{
    flex:1,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  username: {
    fontSize: 25,
    color: '#fff',
    fontWeight:"bold"
  },
  email: {
    fontSize: 20,
    color: '#DAA520',
    marginTop: '3%'
  },
  // description: {
  //   fontSize: 16,
  //   color: '#696969',
  //   marginTop: 10,
  //   textAlign: 'center',
    
  // },
  contentButtons:{
    flex:2,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  buttonContainer: {
    width:'80%',
    height:50,
    marginBottom: '8%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
})
