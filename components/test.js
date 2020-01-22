import React from 'react';
import { StyleSheet, View,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Container,Content,Icon} from 'native-base';
import { ListItem } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import Header from './MiniComponents/Header'
import Footer from './MiniComponents/Footer'
import Loader from './MiniComponents/Loader'
import Separator from './MiniComponents/Separator'
import { URL , Colors, ButtonColors, SwipeButtonsColors, IconColors } from '../Static'

const list = props =>{
    return (
      <SwipeListView
              data={props.lists}
              renderItem={(data, rowMap) => (
                <SwipeRow 
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  stopLeftSwipe={100}
                  stopRightSwipe={-100}
                >
                  <View style={styles.standaloneRowBack}>
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      style={styles.swipeLeftButton}
                      onPress={()=>
                        this.favoriteList(
                          data.item.id,
                          data.item.favorite,
                          data.index)
                      }
                    >
                      <Icon 
                        name='star'
                        style={[
                          styles.swipeIconLeft, 
                          data.item.favorite == true 
                          ? {color: SwipeButtonsColors.star} 
                          : {color: SwipeButtonsColors.nostar}
                        ]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      style={styles.swipeRightButton}
                      // onPress={()=>
                      //     this.deleteList(
                      //       data.item.id,
                      //       data.index)
                      //   }
                    >
                      <Icon 
                        name='trash'
                        style= {styles.swipeIconRight} 
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.standaloneRowFront}>
                    <ListItem
                      title={data.item.name}
                      chevron
                      bottomDivider

                    />
                  </View>
                </SwipeRow>
              )}
            />
    );
}
export default list

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  swipeContainer: {
    flex: 1,
  },
  standaloneRowBack: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  swipeLeftButton:{
    backgroundColor: SwipeButtonsColors.left,
    width:"50%",
    paddingTop:15,
    paddingBottom:15
  },
  swipeRightButton:{
    backgroundColor:SwipeButtonsColors.right,
    width:"50%",
    alignItems:"flex-end",
    padding:15
  },
  swipeIconRight: {
      color: SwipeButtonsColors.trash,
      marginRight:"4%"
  },
  swipeIconLeft: {
    marginLeft:"15%"
  },
  sharedSwipeLeftButton:{
    paddingTop:22,
    paddingBottom:22
  },
  sharedSwipeRightButton:{
    padding : 22
  }
});