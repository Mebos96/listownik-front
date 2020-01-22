import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';


export default class MultiButton extends Component {

  render() {
    return (
        <ActionButton buttonColor="rgba(231,76,60,1)" style={{zIndex:2}}>
          <ActionButton.Item buttonColor='#9b59b6' title="New product" onPress={() => this.props.addProduct()}>
            <Icon name="md-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Clear list" onPress={() => this.props.clearList()}>
            <Icon name="md-trash" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Save list" onPress={() => this.props.saveList()}>
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