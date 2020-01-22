import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Header } from 'native-base'
import { Colors, TextColors } from '../../Static'

const header = props =>{

    return(
        <Header style={styles.header}>
            <Text style={styles.text}>{props.title}</Text>
        </Header>
    )
}
export default header

const styles = StyleSheet.create({
    header:{
      height:80,
      backgroundColor: Colors.primary,
      alignItems:"flex-end"
    },
    text:{
        color: TextColors.primary,
        fontSize: 25,
        padding: 15,
    }
  });