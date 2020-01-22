import React from 'react';
import {StyleSheet, View} from 'react-native';
import { Bubbles} from 'react-native-loader';
import { Colors } from '../../Static'

export default function loader(){
    return(
        <View style={styles.loadingContainer}>
            <Bubbles size={10} color={Colors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer:{
        flex:1,
        alignItems:'center', 
        marginTop:"60%"
      },
  });
  
