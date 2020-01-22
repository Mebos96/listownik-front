import React, { Component } from 'react';
import {Container,Content} from 'native-base';
import {StyleSheet,Text,View,AsyncStorage, ScrollView} from 'react-native';
import GradientButton from 'react-native-gradient-buttons'
import Header from './MiniComponents/Header'
import Footer from './MiniComponents/Footer'
import Loader from './MiniComponents/Loader'
import PickerType from './MiniComponents/PickerType'
import PickerShop from './MiniComponents/PickerShop'
import MultiButtonShow from './MiniComponents/MultiButtonShow'
import AlreadyProductsList from './MiniComponents/AlreadyProductsList'
import { URL, Colors, ButtonColors } from '../Static'

export default class AddList extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        idList:this.props.navigation.state.params.idList,
        idOwner:this.props.navigation.state.params.idOwner,
        list:{},
        id:'',//Id zalogowanego uzytkownika
        products:[],//Produkty na liście
        sortByType:'0',
        sortByShop:'0',
        sortOpen: false
    }
    this.fetchData = this.fetchData.bind(this)
    this.sortByType = this.sortByType.bind(this)
    this.sortByShop = this.sortByShop.bind(this)
    this.buy = this.buy.bind(this)
    this.editList = this.editList.bind(this)
    this.changeSortOpen = this.changeSortOpen.bind(this)
  }

  componentDidMount(){
    this.fetchData()
  }
  // Pobranie listy i produktów na liście
  async fetchData(){
    let id = await AsyncStorage.getItem('ID')
    await fetch(URL + 'list/' + this.state.idList)
    .then((response)=> response.json())
    .then(res => this.setState({
        list:res,
        id:id,
    }))
    .catch(function (err) {
        console.log(err)
        return err;
    });
    //////////////////////////////////////////////
    await fetch(URL + 'getProducts/', { 
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          idList: this.state.idList,
        })
      })
      .then((response) => response.json())
      .then(res => {
        this.setState({
          products:res.data
        })
      })
      .then(()=>{
        this.sortByBought()
        this.setState({
          isLoading:false,
        })
      })
      .catch(function (err) {
        console.log(err)
        return err;
      });
  }

  //Zaznaczanie checkboxów czy kupione
  //SKONCZONE
  async buy(id, bought, index){
    await fetch(URL + 'list_product/' + id, { 
        method: 'patch',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          isBought: !bought,
        })
      })
      .then( 
        this.state.products[index].isBought = !this.state.products[index].isBought,
        this.forceUpdate(),
        this.sortByBought()
        )
      .catch(function (err) {
        console.log(err)
        return err;
      });
  }

  sortByType(arr){
    this.setState({sortByType:arr})
  }

  sortByShop(arr){
    this.setState({sortByShop:arr})
  }

  sortByBought(){
    let arrayNotBought = this.state.products.filter(product => product.isBought === false)
    let arrayBought = this.state.products.filter(product => product.isBought === true)
    let arrayDone = arrayNotBought.concat(arrayBought)
    this.setState({
      products:arrayDone
    })
  }

  changeSortOpen(){
    this.setState({
      sortOpen: !this.state.sortOpen
    })
  }

  editList(){
    this.props.navigation.navigate('EditList',{idList:this.state.idList})
  }

  render() {
    const renderList =
      <Container style={styles.container}>
        <Header title='Show list'/>
        <Content contentContainerStyle={styles.content}>

          {/*Nazwa listy*/}
          <View style={styles.listName}>
            <Text style={styles.listNameText}>
                {this.state.list.name}
            </Text>
          </View>

          {/*Sort*/}
          {this.state.sortOpen === true
            ? <View style={styles.buttonsContainer}>
                <View>
                  <PickerShop sortByShop={this.sortByShop}/>
                  <Text style={styles.pickerInfo}>
                    Sort by Shop
                  </Text>
                </View>
                
                <View>
                  <PickerType sortByType={this.sortByType}/>
                  <Text style={styles.pickerInfo}>
                    Sort by type
                  </Text>
                </View>
              </View>
            :null
          }
          
          {/*Info*/}
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText,{marginLeft:20}]}>Bought?</Text>
            <Text style={[styles.infoText,{marginLeft:20}]}>Product</Text>
          </View>
          
          {/*Wyswietlenie listy produktów */}
          <ScrollView>
            <AlreadyProductsList 
              products={this.state.products}
              buy={this.buy}
              sortByType={this.state.sortByType}
              sortByShop={this.state.sortByShop}
            />
          </ScrollView>
        
          <MultiButtonShow
            isSortOpen={this.state.sortOpen}
            owner = {this.state.id == this.state.idOwner ? true : false}
            changeSortOpen={this.changeSortOpen}
            editList={this.editList}
          />
        </Content>
        <Footer/>
      </Container>
    return (
      <Container>
        {this.state.isLoading === true
          ? <Loader/>
          : renderList 
        } 
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
      backgroundColor: Colors.second,
    },
    infoText:{
      color:'#fff',
      margin:5
    },
    listNameText:{
        fontSize:20,
        margin:5
    },
    listName:{
      backgroundColor:'#ddd',
      alignItems:"center",
      justifyContent:"center"
    },
    buttonsContainer:{
      backgroundColor:'#ddd',
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"space-around",
      padding:10
    },
    infoContainer:{
      backgroundColor:'#aaa',
      flexDirection:"row",
      justifyContent:"space-between"
    },
    pickerInfo:{
      marginLeft:'25%'
    }
  });
  