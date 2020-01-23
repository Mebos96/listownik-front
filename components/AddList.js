import React, { Component } from 'react';
import {Container,Content} from 'native-base';
import {StyleSheet,Text,View,TextInput, AsyncStorage, ScrollView, Alert} from 'react-native';
import { NavigationActions } from 'react-navigation'
import Header from './MiniComponents/Header'
import Footer from './MiniComponents/Footer'
import MultiButtonAdd from './MiniComponents/MultiButtonAdd'
import AddProduct from './MiniComponents/AddProduct'
import NewProductsList from './MiniComponents/NewProductsList'
import { URL, Colors, ButtonColors } from '../Static'

export default class AddList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible:false,

      products:[],//produkty na liscie
      types:[],//Wszystkie typy z bazy
      units:[],//Wszystkie unity z bazy
      idList:'',
      listName:''//Nazwa listy
    }
    this.setVisible = this.setVisible.bind(this)
    this.makeProducts = this.makeProducts.bind(this)
    this.getListId = this.getListId.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.saveList = this.saveList.bind(this)
    this.postListProducts = this.postListProducts.bind(this)
    this.delete = this.delete.bind(this)
    this.clearList = this.clearList.bind(this)
  }

  componentDidMount(){
    this.fetchData()
  }

  valid(){
    if(this.state.listName === ''){
      Alert.alert('Error','List name can`t be empty')
      return false
    } 
    return true
  }

  /// pozyskanie typów i unitów z bazy
  async fetchData(){
    await fetch(URL + 'types/')
    .then((response) => response.json())
    .then(res => {
        this.setState({
        types:res
        })
    })
    .catch(function (err) {
        console.log(err)
        return err;
    });
    /////////////////////////////////
    await fetch(URL + 'measures/', { 
        method: 'get',
        headers: {'Content-Type':'application/json'},
    })
    .then((response) => response.json())
    .then(res => {
        this.setState({
        units:res
        })
    })
    .catch(function (err) {
        console.log(err)
        return err;
    });
  }

  // otwieranie i zamykanie overlaya
  // SKONCZONE
  setVisible(){
    this.setState({
      isVisible: !this.state.isVisible
    })
  }

  // Dodawanie productów z overlaya do tabeli aby je zfeczowac
  // SKONCZONE
  makeProducts(idProduct,idShop, amount){
    let data={}
    data.amount = amount
    data.idProduct = idProduct
    data.idShop = idShop
    this.setState(state=>{
      const products = state.products.concat(data)
      return{
        products
      }
    })
  }

  /// Pozyskanie ostatniego id listy
  /// SKONCZONE
  async getListId(){
    await fetch(URL + 'listId/')
    .then((response) => response.json())
    .then(res => {
        this.setState({
        idList: res.id
        })
    })
    .catch(function (err) {
        console.log(err)
        return err;
    });
  }

  // Tworzenie nowej listy
  // SKONCZONE
  async createList(){
    let id = await AsyncStorage.getItem('ID')
    await fetch(URL + 'lists/', { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "name": this.state.listName,
        "idOwner": id
      })
    })
    .then((response) => response.json())
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  delete(index){
        let array = [...this.state.products]
        array.splice(index,1)
        this.setState({
          products: array
        })
  }

  clearList(){
    this.setState({products:[]})
  }

  async postListProducts(product){
    await fetch(URL + 'list_products/', { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "amount": product.amount,
        "idList": product.idList,
        "idProduct":product.idProduct,
        "idShop":product.idShop
      })
    })
    .then((response) => response.json())
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }
  /// Dodawanie do tabeli list_product
  async saveList(){
    if(this.valid()){
      await this.createList()
      await this.getListId() 
      this.state.products.map((product,i)=>{
        product.idList = this.state.idList
        this.postListProducts(product)
      })
      let id = await AsyncStorage.getItem('ID')
      this.props.navigation.reset(
        [NavigationActions.navigate(
          { routeName: 'ShowList',
            params:{idList:this.state.idList,idOwner:id}
          },)], 0)
    }
    this.setState({
      products:[],
      idList:'',
      listName:''
    })
    
  }

  render() {

    if(this.state.isVisible === true){
      return(
        <AddProduct 
          isVisible={this.state.isVisible}
          setVisible={this.setVisible}
          types={this.state.types}
          units={this.state.units}
          makeProducts={this.makeProducts}
        />
      )
    }
     
    return (
      <Container style={styles.container}>
        <Header title='Add list'/>
        <Content contentContainerStyle={styles.content}>

          {/*Input nazwy listy*/}
          <View style={styles.listNameInputContainer}>
            <TextInput
              placeholder="List name"
              value={this.state.listName}
              placeholderTextColor='#666'
              underlineColorAndroid='#666'
              style={styles.listNameInput}
              onChangeText={(listName)=> this.setState({listName})}
            />
          </View>

          {/*Info*/}
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText,{marginLeft:10}]}>Delete</Text>
            <Text style={[styles.infoText,{marginLeft:20}]}>Product</Text>
          </View>
          
          {/*Wyswietlenie listy produktów */}
          <ScrollView>
            <NewProductsList products={this.state.products} delete={this.delete} title=""/>
          </ScrollView>

          <MultiButtonAdd 
            addProduct={this.setVisible}
            clearList={this.clearList}
            saveList={this.saveList}
          />
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
      backgroundColor: Colors.second,
    },
    infoContainer:{
      backgroundColor:'#aaa',
      flexDirection:"row"
    },
    infoText:{
      color:'#fff',
      margin:5
    },
    listNameInputContainer:{
      backgroundColor:'#ddd',
      alignItems:"center",
      justifyContent:"center",
      padding:10
    },
    listNameInput:{
      width:'80%',
      padding:10,
      fontSize:18,
      textAlign:"center"
    }
  });
  