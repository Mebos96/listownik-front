import React from 'react';
import { StyleSheet, View , TextInput, Keyboard } from 'react-native';
import { Container,Content } from 'native-base';
import {AsyncStorage} from 'react-native';
import { CheckBox  } from 'react-native-elements';
import { Overlay } from 'react-native-elements';
import GradientButton from 'react-native-gradient-buttons';
import Footer from './MiniComponents/Footer'
import Loader from './MiniComponents/Loader'
import Header from './MiniComponents/Header'
import Separator from './MiniComponents/Separator'
import UserLists from './MiniComponents/UserLists'
import Login from './Login'
import { URL,Colors, ButtonColors, OverlayColors } from '../Static'

export default class Share extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        myLists:[],
        isLogged:'',
        isLoading: true,
        isVisible: false,
        users:[],
        userId:null,
        userName:'',
      }
      this.checkLog = this.checkLog.bind(this)
      this.fetchData = this.fetchData.bind(this)
      this.startChecked = this.startChecked.bind(this)
      this.check = this.check.bind(this)
      this.visibleOverlay = this.visibleOverlay.bind(this)
      this.getUser = this.getUser.bind(this)
      this.postSubscriptions = this.postSubscriptions.bind(this)
    }

  componentDidMount(){
    this.checkLog()
    this.fetchData()
  }

  async checkLog(){
    let status = await AsyncStorage.getItem('ID')
    this.setState({
      isLogged:status
    })
  }

  async fetchData(){
    let id = await AsyncStorage.getItem('ID')
    if(id === null) return
    ///////////////////////Fetch my lists//////////////////////////////////////////
    await fetch(URL + 'userLists/', { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        idUser: id,
      })
    })
    .then((response) => response.json())
    .then(res => {
      this.setState({
        myLists:res.data,
        isLoading : false,
        toShare: Array(res.data.length).fill(false),
      })
    })
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  async postSubscriptions(){
    let id = await AsyncStorage.getItem('ID')
    await this.state.toShare.map((list,i)=>{
      if(list == true){
        fetch(URL + 'subscriptions/', { 
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "idOwner": id,
            "idList": this.state.myLists[i].id,
            "idSubscription": this.state.userId
          })
        })
        .then((response) => response.json())
        .then(res => res)
        .catch(function (err) {
          console.log(err)
          return err;
        });
      }
    })
    this.visibleOverlay()
  }

  startChecked(index){
    if(this.state.toShare != undefined) return this.state.toShare[index]
  }

  check(index){
    this.state.toShare[index] = !this.state.toShare[index]
    this.forceUpdate()
  }

  visibleOverlay(){
    this.setState({
      isVisible: !this.state.isVisible,
      userName:'',
      users:[]
    })
  }

  async searchUser(e){
    this.setState({
      userName:e
    })
    await fetch(URL + 'username/', { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        name: e,
      })
    })
    .then((response) => response.json())
    .then(res => {
      this.setState({
        users: res.data,
      })
    })
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  getUser = (id,name)=>{
    this.setState({
      userId: id,
      userName:name
    })
    Keyboard.dismiss()
  }

  render() {
    const renderShare=
      <Container style={styles.container}>
          <Header title='Share lists'/>

          <Content> 
            <Separator title='My lists'/>
            {this.state.myLists.map((l, i) => (
                <CheckBox
                  key={i}
                  title={l.name}
                  checked={this.startChecked(i)}
                  onPress={()=> this.check(i)}
                />
            ))}
          </Content>

          {/*Share button*/}
          {this.state.toShare != undefined ? 
            this.state.toShare.includes(true) ?
              <View style={styles.shareButtonContainer}>
                <GradientButton
                  text="Share"
                  textStyle={{fontSize:15}}
                  style={styles.shareButton}
                  gradientBegin= {ButtonColors.primary}
                  gradientEnd={ButtonColors.second}
                  height={45}
                  width='30%'
                  radius={10}
                  impact
                  onPressAction={this.visibleOverlay}
                />
              </View>
            :null
          :null
          }

          {/*Overlay */}
          {this.state.isVisible ?
            <Overlay 
              isVisible={this.state.isVisible} 
              fullScreen
            >

              {/*Buttons */}
              <View style={styles.overlayButtonsContainer}>
                <GradientButton
                  text="Cancel"
                  textStyle={{fontSize:15}}
                  style={styles.shareButton}
                  gradientBegin= {OverlayColors.cancelButtonPrimary}
                  gradientEnd={OverlayColors.cancelButtonSecond}
                  height={45}
                  width='30%'
                  radius={10}
                  impact
                  onPressAction={this.visibleOverlay}
                />
                <GradientButton
                  text="Share"
                  textStyle={{fontSize:15}}
                  style={styles.shareButton}
                  gradientBegin= {OverlayColors.shareButtonPrimary}
                  gradientEnd={OverlayColors.shareButtonSecond}
                  height={45}
                  width='30%'
                  radius={10}
                  impact
                  onPressAction={this.postSubscriptions}
                />
              </View>
              
              {/*Search input */}
              <TextInput
                placeholder="Search user"
                underlineColorAndroid='#aaa'
                style={styles.overlayInput}
                value={this.state.userName}
                onChangeText={text => this.searchUser(text)} 
              />
              
              {/*List of fetched users*/}
              <View style={{height:'70%'}}>
                <UserLists
                  users={this.state.users}
                  getUserId={(id,name) => {this.getUser(id,name)}}
                />
              </View>

            </Overlay>
          :null
          }

          <Footer/>
        </Container>
    return (
        <Container>
          {this.state.isLogged != null 
            ? this.state.isLoading 
              ? <Loader/> 
              : renderShare
            : <Login/>
          }
        </Container>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.second
  },
  shareButtonContainer:{
    backgroundColor:'#EEE',
    alignItems:"center",
    justifyContent:"center"
  },
  shareButton:{
    margin:10,
    alignItems:"center",
    justifyContent:"center"
  },
  overlayInput:{
    width:'90%',
    padding:10,
    margin:'5%',
    fontSize:17,
  },
  overlayButtonsContainer:{
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row",
    marginTop:'10%'
  }
});
  