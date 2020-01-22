import React,{Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Picker, Form } from "native-base";
import { URL, Colors } from '../../Static'

export default class PickerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected : '0',
            data: []
        }
        this.fetchData = this.fetchData.bind(this)
    }
    
    componentDidMount(){
        this.fetchData()
    }

    async fetchData(){
        await fetch(URL + 'types/')
        .then((response) => response.json())
        .then(res => {
            this.setState({
            data:res,
            isLoading: false
            })
        })
        .catch(function (err) {
            console.log(err)
            return err;
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <Picker
                    mode="dropdown"
                    style={styles.picker}
                    selectedValue={this.state.selected}
                    onValueChange={(value)=> {
                        this.setState({selected:value})
                        this.props.sortByType(value)
                    }}
                >
                    <Picker.Item label='All' value='0' />
                    {this.state.data.map((item,i)=>(
                        <Picker.Item label={item.name} value={item.id} key={i}/>
                    ))}
                </Picker>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        borderColor:'#666',
        borderBottomWidth:1,
        marginRight:'5%'
    },
    picker:{
        width: 150,
        height:35
    }

});
  
