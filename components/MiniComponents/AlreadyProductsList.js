import React,{Component} from 'react';
import {Icon} from 'native-base';
import {StyleSheet} from 'react-native';
import { ListItem, CheckBox} from 'react-native-elements'

export default class ProductList extends Component{

    roundAmount(amount){
        let number = parseFloat(amount)
        let text = number.toString(10)
        return text
    }

    renderListItem = (product,i)=>(
        <ListItem
            key={i}
            title={product.productName}
            subtitle={product.typeName}
            bottomDivider
            containerStyle={
                this.props.title !== 'already' && product.isBought == true 
                ? styles.checked 
                : null
            }
            rightTitle={product.shopName}
            rightSubtitle={this.roundAmount(product.amount) + ' ' + product.unitShort}
            leftElement={
                this.props.title === undefined
                ? <CheckBox
                    checked={product.isBought}
                    style={{margin:0,padding:0}}
                    checkedColor='green'
                    onPress={()=> this.props.buy(product.id,product.isBought,i)}
                />
                : <Icon
                    name="trash"
                    style={{marginRight:'5%', opacity:0.5}}
                    onPress={()=> this.props.delete(product.id, this.props.title)}
                />
            }
        />
    )
    render(){
        return (
            this.props.products.map((product,i)=>{
                if((this.props.sortByType === '0') && (this.props.sortByShop === '0')){
                    return this.renderListItem(product,i)
                }
                else if((this.props.sortByShop !== '0') && (this.props.sortByType !== '0')){
                    if(product.idShop_id === this.props.sortByShop){
                        if(product.typeId === this.props.sortByType){
                            return this.renderListItem(product,i)
                        }
                    }
                }
                else if(this.props.sortByShop !== '0'){
                    if(product.idShop_id === this.props.sortByShop){
                        return this.renderListItem(product,i)
                    }
                    else return null
                }
                else if(this.props.sortByType !== '0'){
                    if(product.typeId === this.props.sortByType){
                        return this.renderListItem(product,i)
                    }
                    else return null
                }
            })
        );
    }
}

const styles = StyleSheet.create({
    icon:{
        height:35,
        width:35
    },
    checked:{
        backgroundColor:'#ecfdd8'
    }
  });
  