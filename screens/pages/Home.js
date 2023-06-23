import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import MainButton from "../components/MainButton";
import { ScrollView, StyleSheet } from "react-native";
import colors from "../../util/colors";
import {
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import FeatherIcons from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axiosInstance from "../../util/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import TopNav from "../components/TopNav";

function Home({ navigation }) {
  function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  const isFocused = useIsFocused();

  const [data, setData] = useState({
    amount: "",
    meterNumber: "",
  });

  const [option, setOption] = useState(1);
  const [info,setInfo] = useState({})

  const [loading, setLoading] = useState(false);

  const [amountError, setAmountError] = useState('');
  const [meterError, setMeterError] = useState('');

  useEffect(() => {
    setOption(1);
    setInfo({});
    setData(
      {
        amount: "",
        meterNumber: "",
      }
    )
  },[isFocused])

  const validateMeter = (meterNumbers) =>
  {
    if (meterNumbers.toString().length < 6) {
      setMeterError("Meter number should be only 6 digits");
      return false;
    } else {
      setMeterError('');
      return true;
    }
  }
  
  const validateAmount = (money) => {

    if (!money) {
      setAmountError("Amount is required");
    return false;
    } 

    if (parseInt(money) < 100) {
      setAmountError("Amount should be more than 100 RWF");
      return false;
    } else if (parseInt(money)>182500) {
      setAmountError("Amount should not exceed 182500 (for 5 years)")
      return false;
    } else if (parseInt(money)%100 !=0) {
      setAmountError("Amount should be multiple of 100, (eg: 100,200,300,400,1000,10000,etc)")
      return false;
    }
    else {
      if (!money) {
        setAmountError("Amount is required");
      return false;
      } else {
        setAmountError('')
      return true;
      }
    }
  }

  const buy = async() => {
    try {
      const error1= validateMeter(data.meterNumber);
      const error2=  validateAmount(data.amount);

      if (!error1 || !error2) {
        return;
      }  

      const res = await axiosInstance.post("/tokens", data);
      
      if (res.data.status == 'success') {
        setOption(2);
        setInfo(res.data.info);
        setData(
          {
            amount: "",
            meterNumber: "",
          }
        )
      }

    }
    catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      const field = error?.response?.data?.field || null;
     
      alert(msg)
    }
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.mainContainer} enabled>
        <View style={styles.container}>
          <TopNav active={'home'} navigation={navigation}  />

          
          {
            option == 1?
            <View style={{ padding: 20 }}>
            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                Generate Token
              </Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 17, marginBottom: 6 }}>
                Meter number
              </Text>
              <TextInput
                value={data.meterNumber}
                onChangeText={(val) => {
                  if (!val) {
                    setData({ ...data, meterNumber: '' });
                    validateMeter(val);
                  }
                  if (containsOnlyNumbers(val)) {
                    setData({ ...data, meterNumber: val });
                    validateMeter(val);
                  }
                }}
                maxLength={6}
                style={styles.inputStyle}
                placeholder="Enter meter number"
                keyboardType="numeric"
              />
              {
                meterError ?
                <Text style={{fontSize: 16,color: colors.error}}>
                {meterError}
              </Text>
                  :
                  <></>
              }
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontSize: 17, marginBottom: 6 }}>
                Amount of money (RWF)
              </Text>
              <TextInput
                value={data.amount}
                onChangeText={(val) => {
                  if (!val) {
                    setData({ ...data, amount: '' });
                    validateAmount(val);
                  }
                  if (containsOnlyNumbers(val)) {
                    setData({ ...data, amount: val });
                    validateAmount(val);
                  }
                }}
                maxLength={11}
                style={styles.inputStyle}
                placeholder="Enter amount of money"
                keyboardType="numeric"
              />
                {
                amountError ?
                <Text style={{fontSize: 16,color: colors.error}}>
                {amountError}
              </Text>
                  :
                  <>
                    {
                      data.amount ?
                        <View>
                          <Text style={{fontSize: 17,color: colors.primary,fontWeight: "bold",marginTop: 10}}>{ parseInt(data.amount)/100 + " lighting day/s"}</Text>
                        </View>
                        :
                        <></>
                    }
                  </>
              }
            </View>

            <View style={{ marginBottom: 10 }}>
              <MainButton
                onPress={() => {
                  buy()
                }}
                loading={loading}
                title={"Generate token"}
              />
            </View>
          </View>
              :
              <View style={{ padding: 20 }}>
              <View style={{ marginBottom: 25 }}>
                <Text style={{ fontWeight: "bold", fontSize: 22,textAlign:"center" }}>
                  Token Generated Successfully!!
                </Text>
              </View>
              <View style={{ marginBottom: 25 }}>
                <View style={{ flexDirection: "row",justifyContent: "center" }}>
                  <Text style={{ fontSize: 20 }}>
                 Token:
                </Text>
                    <Text selectable style={{ fontWeight: "bold", fontSize: 20 }}> { info?.token}</Text></View>
                  <View style={{ flexDirection: "row",justifyContent: "center" }}>
                  <Text style={{ fontSize: 20 }}>
                 Lighting days:
                </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}> { info?.tokenValueDays} day/s</Text></View>
                  <View style={{ flexDirection: "row",justifyContent: "center" }}>
                  <Text style={{ fontSize: 20 }}>
                 Meter number:
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}> { info?.meterNumber}</Text></View>
                  <View style={{ flexDirection: "row",justifyContent: "center" }}>
                  <Text style={{ fontSize: 20 }}>
                 Amount:
                </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}> { info?.amount?.toLocaleString() + " RWF"}</Text></View>
                  <View style={{ flexDirection: "row",justifyContent: "center" }}>
                  <Text style={{ fontSize: 20 }}>
                 Date:
                </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}> {new Date(info?.createdAt).toLocaleDateString() + " - "+new Date(info?.createdAt).toLocaleTimeString()}</Text></View>
              </View>
  
              <View style={{ marginBottom: 10 }}>
                <MainButton
                  onPress={() => {
                    setOption(1)
                  }}
                  loading={loading}
                  title={"Buy New"}
                />
              </View>
  
              </View>
          }
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.white,
    height: "100%",
    width: "100%",
    position: "relative",
    minHeight: Dimensions.get("window").height,
  },
  whiteBanner: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingTop: 60,
    // position: "absolute",
    bottom: 0,
    width: "100%",
    marginTop: 80,
  },
  inputStyle: {
    borderColor: colors.lightest,
    borderWidth: 1,
    width: "100%",
    position: "relative",
    fontSize: 22,
    padding: 17,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    color: colors.light,
    fontWeight: "bold",
    marginBottom: 10
  },
  icon: {
    position: "absolute",
    color: colors.light,
    top: 12,
    left: 15,
  },
  line: {
    height: 1,
    borderBottomColor: "#EBF0FF",
    borderBottomWidth: 1,
    flex: 1,
  },
  socialBtn: {
    backgroundColor: colors.white,
    padding: 18,
    paddingBottom: 20,
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.lightest,
    marginBottom: 10,
  },
});

export default Home;
