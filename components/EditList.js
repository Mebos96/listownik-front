import React, { Component } from 'react';
import {Container,Content} from 'native-base';
import {StyleSheet,Text,View,TextInput,ScrollView, Alert} from 'react-native';
import Header from './MiniComponents/Header'
import Footer from './MiniComponents/Footer'
import MultiButtonAdd from './MiniComponents/MultiButtonAdd'
import AddProduct from './MiniComponents/AddProduct'
import NewProductsList from './MiniComponents/NewProductsList'
import AlreadyProductsList from './MiniComponents/AlreadyProductsList'
import Loader from './MiniComponents/Loader'
import { URL, Colors } from '../Static'

export default class EditList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible:false,
      products:[],// nowe produkty na liscie
      types:[],//Wszystkie typy z bazy
      units:[],//Wszystkie unity z bazy
      idList:this.props.navigation.state.params.idList,
      listName:'',//Nowa nazwa listy
      list:{},//Aktualna lista pobrana z bazy
      alreadyProducts:[],//Produkty pobrane z bazy danych
      isLoading:true,
      productsToDelete:[]// id produktów do usuniecia z bazy
    }
    this.setVisible = this.setVisible.bind(this)
    this.makeProducts = this.makeProducts.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.saveList = this.saveList.bind(this)
    this.postListProducts = this.postListProducts.bind(this)
    this.delete = this.delete.bind(this)
    this.deleteProducts = this.deleteProducts.bind(this)
  }

  componentDidMount(){
    this.fetchData()
  }

  /// pozyskanie typów, unitów, listy oraz produktów z bazy
  async fetchData(){
    await fetch(URL + 'list/'+ this.state.idList)
    .then((response) => response.json())
    .then(res => {
        this.setState({
        list:res,
        listName: res.name
        })
    })
    .catch(function (err) {
        console.log(err)
        return err;
    });
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
    await fetch(URL + 'measures/')
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
    //////////////////////////////////
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
          alreadyProducts:res.data,
          isLoading:false,
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
    data.idList = this.state.idList
    this.setState(state=>{
      const products = state.products.concat(data)
      return{
        products
      }
    })
  }

  async postListProducts(props){
    await fetch(URL + 'list_products/', { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "amount": props.amount,
        "idList": props.idList,
        "idProduct":props.idProduct,
        "idShop":props.idShop
      })
    })
    .catch(function (err) {
      console.log(err)
      return err;
    });
  }

  async changeListName(){
    await fetch(URL + 'list/' + this.state.idList, { 
        method: 'patch',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          name: this.state.listName,
        })
      })
      .catch(function (err) {
        console.log(err)
        return err;
      });
  }

  //usuwanie z widoku i dodanie id listy do usuniecia
  delete(id, title,index){
    if(title == "already"){
        this.setState(state=>{
            const productsToDelete = state.productsToDelete.concat(id)
            return{
              productsToDelete
            }
          })
          this.setState({
            alreadyProducts: this.state.alreadyProducts.filter(product=> product.id != id)
          })
    }
    if(title == "new"){
        let array = [...this.state.products]
        array.splice(index,1)
        this.setState({
          products: array
        })
    }
  }

  async deleteProducts(id){
    await fetch(URL + 'list_product/' + id, { 
        method: 'delete'
    })
    .catch(function (err) {
    console.log(err)
    return err;
    });
  }

  async clearList(){
      Alert.alert('','Do you want clear list?',[
          {
            text: 'Cancel',
            onPress: () => console.log('nie'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {
            this.setState({
                products:[],
            })
            this.state.alreadyProducts.map((product,i)=>{
                this.deleteProducts(product.id)
            })
          }},
      ])

  }

  /// Dodawanie do tabeli list_product
  async saveList(){
    if(this.state.listName !== this.state.list.name) await this.changeListName()

    this.state.productsToDelete.map((id,i)=>{
      this.deleteProducts(id)
    })
    this.state.products.map((product,i)=>{
      this.postListProducts(product)
    })
    // this.setState({
    //   products:[],
    //   idList:'',
    //   listName:''
    // })
  }

  render() {

    if(this.state.isLoading === true) return <Loader/>
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
        <Header title='Edit list'/>
        <Content contentContainerStyle={styles.content}>

          {/*Input nazwy listy*/}
          <View style={styles.inputListNameContainer}>
            <TextInput
              placeholder="List name"
              value={this.state.listName}
              placeholderTextColor='#666'
              underlineColorAndroid='#666'
              style={styles.inputListName}
              onChangeText={(listName)=> this.setState({listName})}
            />
          </View>

          {/*Info*/}
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText,{marginRight:20}]}>Delete</Text>
            <Text style={[styles.infoText]}>Product</Text>
          </View>
          
          {/*Wyswietlenie listy produktów */}
          <ScrollView>

            <AlreadyProductsList 
              products={this.state.alreadyProducts}
              title="already"
              delete={this.delete}
              sortByType="0"
              sortByShop='0'
            />

            <NewProductsList 
              products={this.state.products}
              title="new"
              delete={this.delete}
            />
            
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
    inputListNameContainer:{
      backgroundColor:'#ddd',
      alignItems:"center",
      justifyContent:"center",
      padding:15
    },
    inputListName:{
      width:'80%',
      padding:10,
      fontSize:18,
      textAlign:"center"
    }
  });
  