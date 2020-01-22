import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container,Content } from 'native-base';
import {AsyncStorage} from 'react-native';
import Footer from './MiniComponents/Footer'
import Loader from './MiniComponents/Loader'
import Header from './MiniComponents/Header'
import Separator from './MiniComponents/Separator'
import SwipeMyLists from './MiniComponents/SwipeMyLists'
import SwipeSharedLists from './MiniComponents/SwipeSharedLists'
import { URL, Colors } from '../Static'

export default class Favorite extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        myLists:[],
        sharedLists:[],
        isLoading: true,
        isLogged:''
      }
      this.checkLog = this.checkLog.bind(this)
      this.fetchData = this.fetchData.bind(this)
      this.favoriteList = this.favoriteList.bind(this)
      this.favoriteSubscription = this.favoriteSubscription.bind(this)
      this.deleteList = this.deleteList.bind(this)
      this.deleteSubscription = this.deleteSubscription.bind(this)
    }

  componentDidMount=()=>  {
    this.checkLog()
    this.fetchData()
  }

  async checkLog(){
    let status = await AsyncStorage.getItem('ID')
    this.setState({
      isLogged:status
    })
  }
/////////////////////////////////Fetch//////////////////////////////////////////
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
        myLists:res.data
      })
    })
    .catch(function (err) {
      console.log(err)
      return err;
    });
    ////////////////////Fetch shared lists//////////////////////////////////////////
    await fetch(URL + 'sharedLists/', { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        idUser: id,
      })
    })
    .then((response) => response.json())
    .then(res => {
      this.setState({
        sharedLists:res.data,
        isLoading : false
      })
    })
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  async favoriteList(id, fav, index){
    await fetch(URL + 'list/' + id, { 
      method: 'patch',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        favorite: !fav,
      })
    })
    .then( 
      this.state.myLists[index].favorite = !this.state.myLists[index].favorite,
      this.forceUpdate()
      )
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  async favoriteSubscription(id, fav, index){
    await fetch(URL + 'subscription/' + id, { 
      method: 'patch',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        favorite: !fav,
      })
    })
    .then( 
      this.state.sharedLists[index].favorite = !this.state.sharedLists[index].favorite,
      this.forceUpdate()
      )
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  async deleteList(id, index){
    await fetch(URL + 'list/' + id, {
      method: 'delete',
      headers: {'Content-Type':'application/json'}
    })
    .then( 
      this.state.myLists.splice(index,1),
      this.forceUpdate()
    )
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  async deleteSubscription(id, index){
    await fetch(URL + 'subscription/' + id, {
      method: 'delete',
      headers: {'Content-Type':'application/json'}
    })
    .then( 
      this.state.sharedLists.splice(index,1),
      this.forceUpdate()
    )
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }
////////////////////////////////////////////////////////////////////////////////

  render() {
      if(this.state.isLoading === true) return <Loader/>
        
    return (
      <Container>
      <Header title='Favorite lists'/>

      <Content style={{backgroundColor: Colors.second}}> 

        {/* MY LISTS */}
        <Separator title='My lists'/>

        <View style={styles.swipeContainer}>
          <SwipeMyLists 
            lists={this.state.myLists.filter(({favorite})=> favorite === true)}
            favoriteList={this.favoriteList}
            deleteList={this.deleteList}
          />
        </View>

        {/* SHARED LISTS */}
        <Separator title='Lists shared to me'/>

        <View style={styles.swipeContainer}>
            <SwipeSharedLists
              lists={this.state.sharedLists.filter(({favorite})=> favorite == true)}
              favoriteSubscription={this.favoriteSubscription}
              deleteSubscription={this.deleteSubscription}
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
  swipeContainer: {
    flex: 1,
  },
});
  