import React from 'react';
import {StyleSheet ,Text} from 'react-native';
import { Separator } from 'native-base';
import { SeparatorColors } from '../../Static'

const separator = props =>{
    return(
        <Separator bordered style={styles.separator}>
            <Text >{props.title}</Text>
        </Separator>
    )
}

export default separator

const styles = StyleSheet.create({
    separator:{
        backgroundColor:SeparatorColors.primary,
        height:40
      },
  });
  
