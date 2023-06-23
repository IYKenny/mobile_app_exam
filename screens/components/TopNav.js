import { View, Text, StyleSheet,Dimensions,TouchableOpacity,SafeAreaView, TextInput } from 'react-native'
import EntypoIcons from 'react-native-vector-icons/Entypo';
import colors from '../../util/colors';
import Ionicons from "react-native-vector-icons/Ionicons"
import { useState } from 'react';

const TopNav = (props) => {

    return (
        <>
            <SafeAreaView>
                <View style={[styles.topBar,{flexDirection: "row", justifyContent: "space-between", alignItems: "center",columnGap: 20}]}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("Home")
                    }} style={styles.navItem}>
                        <Text style={{fontSize: 14,color: props?.active == 'home'? colors.primary : "black"}}>Buy Token</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("CheckPage")
                    }} style={styles.navItem}>
                        <Text style={{fontSize: 14,color: props?.active == 'check'? colors.primary : "black"}}>Tokens</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("ValidateToken")
                    }} style={styles.navItem}>
                        <Text style={{fontSize: 14,color: props?.active == 'validate'? colors.primary : "black"}}>Validate Tokens</Text>
                    </TouchableOpacity>
            </View>
           </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: colors.primary,
        width: "100%",
        paddingRight: 20,
        paddingLeft: 20,
        bottom: 0,
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: 80,
        paddingTop: 25,
        paddingBottom: 15
    },
    navItem: {
        backgroundColor: "white",
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 25,
        paddingBottom: 10
    },
    iconColor: "#F7941D",
  });

export default TopNav;