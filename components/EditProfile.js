import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Alert,
  Keyboard,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import { Container,Content} from 'native-base';
import GradientButton from 'react-native-gradient-buttons';
import Header from './MiniComponents/Header'
import Footer from './MiniComponents/Footer'
import Loader from './MiniComponents/Loader'
import { URL, Colors, ButtonColors } from '../Static'

export default class ProfileEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: null,
      username: '',
      email: '',
      password: '',
      repassword: '',
      avatarUri: 'https://i.imgur.com/bWln98R.jpeg',
    }
    this.fetchData = this.fetchData.bind(this)
    this.checkStates = this.checkStates.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
  }
  
  componentDidMount(){
    this.fetchData()
  }

  async fetchData(){
    let id = await AsyncStorage.getItem('ID')
    if(id === null) return
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
  
  placeholderValue(arr){
    if(this.state.user !== null) return this.state.user[arr]
  }

  checkStates(){
    let data = {}
    if(this.state.username !== '') data.username = this.state.username
    if(this.state.email !== '')
        if((this.state.email.lastIndexOf('@') > this.state.email.lastIndexOf('.'))||(this.state.email.includes('@') === false)||(this.state.email.includes('.') === false)) Alert.alert('Error','Email is not correct')
        else data.email = this.state.email
    if(this.state.password !== '')
      if(this.state.repassword !== '')
        if(this.state.password === this.state.repassword) data.password = this.state.password
        else { Alert.alert(
            'Error',
            'Passwords are not the same',
            [
              {text:'Ok',
              onPress: ()=>this.setState({
                password:'',
                repassword :''
              })}
            ]
        )}
      else Alert.alert('Error','You must confirm password')
    return data
  }

  async saveProfile(){
    if(Object.keys(this.checkStates()).length >0){
      await fetch(URL + 'user/' + this.state.user.id, { 
        method: 'patch',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(this.checkStates())
      })
      .then((response)=> {
        if(response.status === 200) Alert.alert('Success','Data has been changed')
        this.setState({
          username: '',
          email: '',
          password: '',
          repassword: '',
        })
      })
      .then(this.fetchData())
      .catch(function (err) {
        console.log(err)
        return err;
      });
    }
  }
  render() {
    if(this.state.isLoading) return <Loader/> 

    return (
      <Container style={styles.container} onPress={()=> Keyboard.dismiss()}>
        <Header title='Edit profile'/>

        <Content contentContainerStyle={styles.content}>

          <View style={styles.avatarContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={()=> console.log("Zmień obraz")} >
              <Image style={styles.avatar} source={{uri: this.state.avatarUri }}/>
            </TouchableOpacity>
          </View>
                    
          <View style={styles.inputsContainer}>
            <TextInput style={styles.input}
              placeholder={this.placeholderValue('username')}
              value={this.state.username}
              placeholderTextColor='#fff'
              keyboardType="name-phone-pad"
              underlineColorAndroid='#fff'
              onChangeText={(username) => this.setState({username})}
            />

            <TextInput style={styles.input}
              placeholder={this.placeholderValue('email')}
              value={this.state.email}
              keyboardType='email-address'
              autoCapitalize='none'
              underlineColorAndroid='#fff'
              placeholderTextColor='#fff'
              onChangeText={(email) => this.setState({email})}
            />

            <TextInput style={styles.input}
              placeholder="New Password"
              value={this.state.password}
              secureTextEntry={true}
              returnKeyType='next'
              autoCapitalize='none'
              underlineColorAndroid='#fff'
              placeholderTextColor='#fff'
              onSubmitEditing={()=>{this.confirmPassword.focus()}}
              onChangeText={(password) => this.setState({password})}
            />

            <TextInput style={styles.input}
              placeholder="Repeat New Password"
              value={this.state.repassword}
              secureTextEntry={true}
              autoCapitalize='none'
              underlineColorAndroid='#fff'
              placeholderTextColor='#fff'
              ref={(ref)=>{this.confirmPassword = ref}}
              onChangeText={(repassword) => this.setState({repassword})}
            />

          </View>

          <View style={styles.buttonsContainer}>
            <GradientButton
              text="Save"
              textStyle={{ fontSize: 20 }}
              gradientBegin= {ButtonColors.primary}
              gradientEnd={ButtonColors.second}
              height={60}
              width='90%'
              radius={15}
              impact
              onPressAction={this.saveProfile}
            />
          </View>

        </Content>
        <Footer/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor:Colors.second
  },
  avatarContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:"center"
  },
  inputsContainer:{
    flex:2,
    alignItems:"center",
    justifyContent:"center"
  },
  buttonsContainer:{
    flex:0.5,
    alignItems:"center",
    justifyContent:"flex-start"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary
  },
  input:{
    width:'90%',
    fontSize:17,
    padding:10,
    marginVertical:5,
    color:'#fff'
  },
});
