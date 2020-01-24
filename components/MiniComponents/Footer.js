import React from 'react';
import {StyleSheet ,Text} from 'react-native';
import {Footer, FooterTab, Button, Icon} from 'native-base';
import { Colors, TextColors } from '../../Static'
import { withNavigation, NavigationActions } from 'react-navigation'

const footer = (props) =>{
    return(
        <Footer>
            <FooterTab style={styles.footerContainer}>
                <Button 
                    vertical 
                    onPress={()=> 
                        props.navigation.reset([NavigationActions.navigate({ routeName: 'Home' })], 0)
                    }
                >
                    <Icon name="home" />
                    <Text style={styles.footerText}>Home</Text>
                </Button>
                <Button 
                    vertical
                    onPress={()=> 
                        props.navigation.reset([NavigationActions.navigate({ routeName: 'Favorite' })],0)
                    }
                >
                    <Icon name='star'/>
                    <Text style={styles.footerText}>Favorite</Text>
                </Button>
                <Button 
                    vertical
                    onPress={()=> 
                        props.navigation.reset([NavigationActions.navigate({ routeName: 'AddList' })], 0)
                    }
                >
                    <Icon name="add"/>
                    <Text style={styles.footerText}>Add list</Text>
                </Button>
                <Button 
                    vertical
                    onPress={()=> 
                        props.navigation.reset([NavigationActions.navigate({ routeName: 'Share' })], 0)
                    }
                >
                    <Icon name="share" />
                    <Text style={styles.footerText}>Share list</Text>
                </Button>
                <Button 
                    vertical 
                    onPress={()=> 
                    props.navigation.reset([NavigationActions.navigate({ routeName: 'Profile' })], 0)
                    }
                >
                    <Icon name="person" />
                    <Text style={styles.footerText}>Profile</Text>
                </Button>
            </FooterTab>
        </Footer>
    )
}
export default withNavigation(footer)

const styles = StyleSheet.create({
    footerContainer:{
        backgroundColor: Colors.primary,
    },
    footerText:{
      color: TextColors.primary,
      opacity:0.5
    },
  });
  
