import React, { Component } from 'react';
import {StyleSheet,Text,View,Alert, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {Form, Item, Input, Label } from 'native-base';
import GradientButton from 'react-native-gradient-buttons';
import { URL, Colors, LogoColors, FormColors, ButtonColors } from '../Static'

export default class RegisterView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email   : '',
      password: '',
      repassword: '',
    }
    this.validateForm = this.validateForm.bind(this)
    this.onClickRegister=this.onClickRegister.bind(this)
  }

  validateForm(){
    if(this.state.username === ''){
      this.setState({
        password : '',
        repassword : ''
      })
      Alert.alert('Error','Username can`t be empty')
      return false
    }
    if(this.state.email === ''){
      this.setState({
        password : '',
        repassword : ''
      })
      Alert.alert('Error','Email can`t be empty')
      return false
    }
    if((this.state.email.includes('@') === false)||(this.state.email.includes('.') === false)) {
      Alert.alert("Error","Email is not correct")
      return false
    }
    if(this.state.email.lastIndexOf('@') > this.state.email.lastIndexOf('.')) {
      Alert.alert('Error','Email is not correct')
      return false
    }
    if(this.state.password === ''){
      this.setState({
        password : '',
        repassword : ''
      })
      Alert.alert('Error','Password can`t be empty')
      return false
    }
    if(this.state.repassword === ''){
      this.setState({
        password : '',
        repassword : ''
      })
      Alert.alert('Error','You must confirm password')
      return false
    }
    if(this.state.password !== this.state.repassword){
      this.setState({
        password : '',
        repassword : ''
      })
      Alert.alert('Error','Passwords are not the same')
      return false
    }
    return true
  }

  async onClickRegister(){
    if(this.validateForm()){
      await fetch(URL + 'register/', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        })
      })
      .then((response) => {
        if(response.status == 400){
          Alert.alert('Error','User already exist')
        }if(response.status === 200){
          Alert.alert('Success','You have successfully registered')
          this.props.navigation.navigate('Login')
        }
      })
      .catch(function (err) {
        console.log(err)
        return err;
      });

      this.setState({
        username:'',
        email:'',
        password:'',
        repassword:''
      })
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Get on Board</Text>
          </View>

          <View style={styles.inputsContainer}>
            <Form>
              <Item floatingLabel style={styles.formItem}>
                <Label style={styles.formLabel}>Username</Label>
                <Input 
                  style={styles.formInput}
                  value={this.state.username}
                  returnKeyType='next'
                  autoCapitalize='none'
                  onSubmitEditing={()=>{this.emailInput._root.focus()}}
                  onChangeText={(username) => this.setState({username})}            
                />
              </Item>
              <Item floatingLabel style={styles.formItem}>
                <Label style={styles.formLabel}>E-mail</Label>
                <Input 
                  keyboardType="email-address"
                  style={styles.formInput}
                  value={this.state.email}
                  returnKeyType='next'
                  autoCapitalize='none'
                  getRef={(ref)=>{this.emailInput = ref}}
                  onSubmitEditing={()=>{this.passwordInput._root.focus()}}
                  onChangeText={(email) => this.setState({email})}            
                />
              </Item>
              <Item floatingLabel style={styles.formItem}>
                <Label style={styles.formLabel}>Enter Password</Label>
                <Input
                  secureTextEntry={true}
                  value={this.state.password}
                  style={styles.formInput}
                  autoCapitalize='none'
                  returnKeyType='next'
                  getRef={(ref)=>{this.passwordInput = ref}}
                  onSubmitEditing={()=>{this.repassInput._root.focus()}}
                  onChangeText={(password) => this.setState({password})}
                />
              </Item>
              <Item floatingLabel style={styles.formItem}>
                <Label style={styles.formLabel}>Confirm Password</Label>
                <Input
                  secureTextEntry={true}
                  value={this.state.repassword}
                  style={styles.formInput}
                  autoCapitalize='none'
                  returnKeyType='go'
                  getRef={(ref)=>{this.repassInput = ref}}
                  onSubmitEditing={()=> this.onClickRegister()}
                  onChangeText={(repassword) => this.setState({repassword})}
                />
              </Item>
            </Form>
          </View>

          <View style={styles.buttonsContainer}>
            <GradientButton
              text="Register"
              textStyle={{ fontSize: 20 }}
              gradientBegin= {ButtonColors.primary}
              gradientEnd={ButtonColors.second}
              height={60}
              width='90%'
              radius={15}
              impact
              onPressAction={this.onClickRegister}
            />

            <Text 
              accessibilityRole='button'
              style={styles.textButton}
              onPress={()=> navigate('Login')}
            >
              I already have an account
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  logoContainer:{
    flex:1,
    justifyContent:"flex-end",
  },
  logoText:{
    color:LogoColors.text,
    marginLeft:'5%',
    fontSize:25,
  },
  inputsContainer:{
    flex:2,
    alignItems:'center',
    justifyContent:"flex-start",
  },
  formItem:{
    width:'90%'
  },
  formLabel:{
    color:FormColors.label,
    opacity:0.5
  },
  formInput:{
    color: FormColors.input
  },
  buttonsContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:"space-around",
  },
  textButton:{
    textDecorationLine:"underline",
    color:ButtonColors.textButton,
    opacity:0.5
  },
});
