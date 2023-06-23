import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button,TouchableOpacity,ScrollView } from 'react-native';
import MainButton from './screens/components/MainButton';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CheckPage from './screens/pages/CheckPage';
import Home from './screens/pages/Home';
import ValidateToken from './screens/pages/ValidateToken';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Home}></Stack.Screen>
        <Stack.Screen options={{ headerShown: false }} name="CheckPage" component={CheckPage}></Stack.Screen>
        <Stack.Screen options={{ headerShown: false }} name="ValidateToken" component={ValidateToken}></Stack.Screen>

      </Stack.Navigator>
  </NavigationContainer>
  );
}