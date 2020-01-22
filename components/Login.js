import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import {Form, Item, Input, Label } from 'native-base';
import { NavigationActions } from 'react-navigation'
import GradientButton from 'react-native-gradient-buttons';
import { URL, Colors, LogoColors, FormColors, ButtonColors } from '../Static'

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
    this.checkLog = this.checkLog.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.onClickLogin=this.onClickLogin.bind(this)
  }

  async componentDidMount(){
    await this.checkLog()
  }
  
  validateForm(){
    if(this.state.email == ''){
      Alert.alert('Error',"Email can`t be empty")
      return false
    }
    if(this.state.password == ''){
      Alert.alert('Error',"Password can`t be empty")
      return false
    }
    if((this.state.email.includes('@') === false)||(this.state.email.includes('.') === false)){
      Alert.alert("Error","Email is not correct")
      return false
    }
    if(this.state.email.lastIndexOf('@')> this.state.email.lastIndexOf('.')){
      Alert.alert('Error','Email is not correct')
      return false
    }
    return true
  }

  async onClickLogin(){
    if(this.validateForm()){
      await fetch(URL + 'login/', { 
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })
      .then((response) => {
        if(response.status == 400){
          Alert.alert('Error', 'User is not exist')
        }
        else{
          response.json()
          .then((res) => {
            AsyncStorage.setItem('ID', JSON.stringify(res.id));
            this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Home' })], 0)
          })
        }
      })
  
      .catch(function (err) {
        console.log(err)
        return err;
      });
      this.setState({
        email:'',
        password:''
      })
    }
  }

  async checkLog(){
    let status = await AsyncStorage.getItem('ID')
    if(status !== null) this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Home' })], 0)
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.container}>
        
          <KeyboardAvoidingView behavior='padding' style={styles.avoidContainer}>

            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Hello there,</Text>
              <Text style={styles.logoText}>welcome back</Text>
            </View>

            <View style={styles.inputsContainer}>
              <Form>
                <Item floatingLabel style={styles.formItem}>
                  <Label style={styles.formLabel}>E-mail</Label>
                  <Input 
                    keyboardType="email-address"
                    style={styles.formInput}
                    value={this.state.email}
                    returnKeyType='next'
                    autoCapitalize='none'
                    onSubmitEditing={()=>{this.secondInput._root.focus()}}
                    onChangeText={(email) => this.setState({email})}            
                  />
                </Item>
                <Item floatingLabel style={styles.formItem}>
                  <Label style={styles.formLabel}>Password</Label>
                  <Input
                    secureTextEntry
                    value={this.state.password}
                    style={styles.formInput}
                    autoCapitalize='none'
                    returnKeyType='go'
                    getRef={(ref)=>{this.secondInput = ref}}
                    onSubmitEditing={this.onClickLogin}
                    onChangeText={(password) => this.setState({password})}
                  />
                </Item>
              </Form>
            </View>

          </KeyboardAvoidingView>
          
          <View style={styles.buttonsContainer}>

            {/* <Text style={styles.textButton} accessibilityRole='button'>Forgot your password?</Text> */}

            <GradientButton
              text="Login"
              textStyle={{ fontSize: 20 }}
              gradientBegin= {ButtonColors.primary}
              gradientEnd={ButtonColors.second}
              height={60}
              width='90%'
              radius={15}
              impact
              onPressAction={this.onClickLogin}
            />

            <Text style={styles.buttonsText}>Don`t have an account?
              <Text accessibilityRole='button' style={styles.textButton} onPress={()=> navigate('Register')}> Sign up!</Text>
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
  avoidContainer:{
    flex:2,
    justifyContent:"space-around"
  },
  logoContainer:{
    flex:1.5,
    justifyContent:'center',
    // backgroundColor:'#00F'
  },
  logoText:{
    color:LogoColors.text,
    marginLeft:'5%',
    fontSize:25
  },
  inputsContainer:{
    flex:1,
    // backgroundColor:'#F00'
  },
  formItem:{
    width:'90%'
  },
  formLabel:{
    color:FormColors.label,
    opacity:0.5
  },
  formInput:{
    color:FormColors.input
  },
  buttonsContainer:{
    flex:1.5,
    alignItems:"center",
    justifyContent:"space-around",
    // backgroundColor:'#0F0'
  },
  textButton:{
    textDecorationLine:"underline",
    color: ButtonColors.textButton,
    opacity:0.5
  },
  buttonsText:{
    color: ButtonColors.buttonText,
    opacity:0.5
  },
});
      
// <Image style={{width:100,height:100, marginBottom:50}} source={require('../Images/Leaf.png')}/>
