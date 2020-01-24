import React,{Component} from 'react';
import {Icon} from 'native-base';
import { ListItem} from 'react-native-elements'
import {URL} from '../../Static'

export default class ProductList extends Component{
    constructor(props){
        super(props)
        this.state={
            products:[],
        }
        this.getProducts =this.getProducts.bind(this)
        this.removeProduct = this.removeProduct.bind(this)
    }

    componentDidMount(){
        this.getProducts()
    }

    getProducts(){
        this.props.products.map((product,i)=>{
            fetch(URL + 'getNewProducts/', { 
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    idProduct: product.idProduct,
                    idShop: product.idShop,
                    amount: product.amount
                })
              })
              .then((response) => response.json())
              .then(res => {
                this.setState({
                  products:[...this.state.products,res.data],
                })
              })
              .catch(function (err) {
                console.log(err)
                return err;
              });
        })
    }
    
    removeProduct(id,index){
        this.props.delete(id, this.props.title,index)
        let array = [...this.state.products]
        array.splice(index,1)
        this.setState({
            products:array
        })
    }
   
    render(){
        
        return (
            this.state.products.map((product,i)=>(
                <ListItem
                key={i}
                title={product.name}
                subtitle={product.typeName}
                bottomDivider
                rightTitle={product.shop}
                rightSubtitle={product.amount + " " +product.unitName}
                leftElement={
                    <Icon 
                        name="trash"
                        style={{marginRight:'5%', opacity:0.5}}
                        onPress={()=> this.removeProduct(product.id,i)}
                    />
                }
            />
            ))
        );
    }
}