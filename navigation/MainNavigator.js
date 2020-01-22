import {createStackNavigator} from 'react-navigation-stack';

import Login from '../components/Login'//
import AddList from '../components/AddList'
import EditList from '../components/EditList'
import EditProfile from '../components/EditProfile'//
import Favorite from '../components/Favorite'//
import Home from '../components/Home'//
import Profile from '../components/Profile'//
import Register from '../components/Register'//
import Share from '../components/Share'//
import ShowList from '../components/ShowList'//

const MainNavigator = createStackNavigator(
    {
        Login: {screen: Login},
        Register: {screen: Register},
        Home: {screen: Home},
        ShowList: {screen: ShowList},
        Favorite: {screen: Favorite},
        Profile: {screen: Profile},
        Share: {screen: Share},
        EditProfile: {screen: EditProfile},
        AddList: {screen: AddList},
        EditList: {screen: EditList},
    },
    {
        headerMode:'none',
    });

export default MainNavigator