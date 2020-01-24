import React from 'react';
import { ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';

const UserList = props =>{
    
    return(
        <ScrollView keyboardShouldPersistTaps={'always'}>
            {props.users.map((user,i) =>{
                return(
                    <ListItem
                        key={i}
                        title={user.username}
                        subtitle={user.email}
                        bottomDivider
                        onPress={()=>{props.getUserId(user.id,user.username)}}
                    />
                )
            })}
        </ScrollView>
    )
}
export default UserList  
