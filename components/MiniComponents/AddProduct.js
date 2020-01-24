import React, { Component } from 'react';
import {StyleSheet,TextInput, View,Text, Alert} from 'react-native';
import { Overlay  } from 'react-native-elements'
import {Picker, Icon} from "native-base";
import GradientButton from 'react-native-gradient-buttons'
import { ListItem } from 'react-native-elements';
import {URL} from '../../Static'

export default class AddProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name:'',//nazwa produktu
        amount: '',//ilosc produktu
        shopName:'',//nazwa sklepu
        idProduct:'',
        idShop:'',
        idType:this.props.types[0].id,//
        idUnit:this.props.units[0].id,//
        products:[],//Wyszukane produkty po nazwie
        shops:[] //Wyszukane sklepy po nazwie
    }
    this.closeOverlay = this.closeOverlay.bind(this)
    this.valid = this.valid.bind(this)
  }

    async valid(){
        if(this.state.name === ''){
            Alert.alert('Error','Product name can`t be empty')
            return false
        }
        if(this.state.amount === ''){
            Alert.alert('Error','Amount can`t be empty')
            return false
        }
        if(this.state.shopName === ''){
            Alert.alert('Error','Shop can`t be empty')
            return false
        }
        if((this.state.name !== '')&&(this.state.idProduct === '')) await this.postProduct()
        if((this.state.shopName !== '')&&(this.state.idShop === '')) await this.postShop()
        if((this.state.shopName !== '')&&(this.state.amount === '')&&(this.state.name === '')) return true
    }

    async postProduct(){
        await fetch(URL + 'products/', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "name": this.state.name,
                "unit_of_measure": this.state.idUnit,
                "idType": this.state.idType
            })
        })
        .catch(function (err) {
        console.log(err)
        return err;
        });
        await fetch(URL + 'productId/')
        .then(response => response.json())
        .then(res => this.setState({idProduct:res.id}))
        .catch(function (err) {
            console.log(err)
            return err;
        });
    }

    async postShop(){
        await fetch(URL + 'shops/', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              name: this.state.shopName,
            })
        })
        .catch(function (err) {
        console.log(err)
        return err;
        });

        await fetch(URL + 'shopId/')
        .then(response=> response.json())
        .then(res => this.setState({idShop:res.id}))
        .catch(function(err){
            console.log(err)
            return err
        })
    }

    // Wyszukanie produktu po nazwie
    // SKONCZONE
    async searchProduct(e){

        this.setState({
        name:e
        })

        await fetch(URL + 'productName/', { 
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: e,
        })
        })
        .then((response) => response.json())
        .then(res => {
        this.setState({
            products: res.data,
        })
        })
        .catch(function (err) {
        console.log(err)
        return err;
        });
    }

    // Wyszkanie sklepu po nazwie
    // SKONCZONE
    async searchShop(e){

        this.setState({
        shopName:e
        })

        await fetch(URL + 'shopName/', { 
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: e,
        })
        })
        .then((response) => response.json())
        .then(res => {
        this.setState({
            shops: res.data,
        })
        })
        .catch(function (err) {
        console.log(err)
        return err;
        });
    }

    closeOverlay(){
        if(this.valid()){
            this.props.makeProducts(this.state.idProduct,this.state.idShop,this.state.amount)
            this.props.setVisible()
        }
    }

  render() {
      let productHeight = this.state.products.length *60
      let shopHeight = this.state.shops.length *60
    return (
        <Overlay fullScreen overlayStyle={{alignItems:"center"}} isVisible={this.props.isVisible}>
            
            <View style={styles.header}>
                <Text style={styles.text}>Add product</Text>

                <GradientButton
                    text={<Icon name="exit" style={{color:"#fff"}}/>}
                    textStyle={{ fontSize:20 }}
                    gradientBegin= "#9b59b6"
                    gradientEnd="#9b59b6"
                    height={50}
                    width={50}
                    radius={50}
                    onPressAction={()=> this.props.setVisible()}
                />
                <GradientButton
                    text={<Icon name="add" style={{color:"#fff"}}/>}
                    textStyle={{ fontSize:20 }}
                    gradientBegin='#3498db'
                    gradientEnd='#3498db'
                    height={50}
                    width={50}
                    radius={50}
                    style={{marginRight:"5%"}}
                    onPressAction={()=>this.closeOverlay()}
                />
            </View>
            
            <TextInput
                placeholder='Product name'
                value={this.state.name}
                underlineColorAndroid='#000'
                style={styles.input}
                onChangeText={(name)=> this.searchProduct(name)}
            />

            {/*Wyswietlenie listy produktów */}
            <View style={[styles.listContainer,{height:productHeight}]}>
                {this.state.products.map((product,i)=>(
                    <ListItem
                        key={i}
                        title={product.name}
                        style={{width:'90%'}}
                        bottomDivider
                        onPress={()=> this.setState({
                            name: product.name,
                            idProduct: product.id,
                            idType: product.idType_id,
                            idUnit: product.unit_of_measure_id,
                            products:[]
                        })}
                    />
                ))}
            </View>
            
            <TextInput
                placeholder='Amount'
                value={this.state.amount}
                style={styles.input}
                underlineColorAndroid='#000'
                onChangeText={(amount)=> this.setState({amount:amount.replace(/[^0-9.]/g, '')})}
            />

            {/*Picker unit */}
            <View style={styles.container}>
                <Picker
                    mode="dialog"
                    prompt='Choose unit of measure'
                    selectedValue={this.state.idUnit}
                    style={styles.picker}
                    onValueChange={(idUnit)=> this.setState({idUnit})}
                >
                    {this.props.units.map((unit,i)=>(
                        <Picker.Item label={unit.name} value={unit.id} key={i}/>
                    ))}
                </Picker>
            </View>

            <TextInput
                placeholder='Search shop'
                value={this.state.shopName}
                style={styles.input}
                underlineColorAndroid='#000'
                onChangeText={(event)=> this.searchShop(event)}
            />

            {/*Wyswietlenie listy sklepów */}
            <View style={[styles.listContainer,{height:shopHeight}]}>
                {this.state.shops.map((shop,i)=>(
                    <ListItem
                        key={i}
                        title={shop.name}
                        style={{width:'90%'}}
                        bottomDivider
                        onPress={()=> this.setState({
                            shopName: shop.name,
                            idShop: shop.id,
                            shops:[]
                        })}
                    />
                ))}
            </View>

            {/*Picker typu */}
            <View style={styles.container}>
                <Picker
                    mode="dialog"
                    prompt='Choose product type'
                    selectedValue={this.state.idType}
                    style={styles.picker}
                    onValueChange={(idType)=> this.setState({idType})}
                >
                    {this.props.types.map((type,i)=>(
                        <Picker.Item label={type.name} value={type.id} key={i}/>
                    ))}
                </Picker>
            </View>
            
        </Overlay>
    );
  }
}

const styles = StyleSheet.create({
    text:{
        fontSize:20,
        width:"55%",
        marginLeft:"5%",
    },
    header:{
        display:"flex",
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    container:{
        width:'90%',
        borderColor:'#666',
        borderBottomWidth:1,
        margin: 10,
    },
    input:{
        width:'92%',
        margin:10,
        padding:10,
        fontSize:17,
    },
    picker:{
        height:40
    },
    listContainer:{
        backgroundColor:'#ddd',
        width:'95%',
        alignItems:"center",
        justifyContent:"center",
        borderRadius:5
    },
  });
  