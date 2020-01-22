import { StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import MainNavigator from './navigation/MainNavigator'

const App = createAppContainer(MainNavigator);

export default App;
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <EditList/>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
