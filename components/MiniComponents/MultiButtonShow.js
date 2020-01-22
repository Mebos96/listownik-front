import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';


export default class MultiButtonShow extends Component {

    renderItem =()=>{
        if(this.props.owner === true){
            return  <ActionButton.Item buttonColor='#3498db' title="Edit list" onPress={() => this.props.editList()}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
        }
        else null
    }
    render() {
        return (
            <ActionButton buttonColor="rgba(231,76,60,1)">
                {this.renderItem()}
                <ActionButton.Item 
                    buttonColor='#1abc9c'
                    title={
                        this.props.isSortOpen === true 
                        ? "Close sort" 
                        : "Open sort"
                    }
                    onPress={() => this.props.changeSortOpen()}
                >
                    <Icon name="md-done-all" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        );
    }

}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});