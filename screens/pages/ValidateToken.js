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

function ValidateToken({ navigation }) {
  function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  const [data, setData] = useState({
    meter: "",
    meterNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const [amountError, setAmountError] = useState("");
  const [meterError, setMeterError] = useState("");

  const validateMeter = (meterNumbers) => {
    if (meterNumbers.toString().length < 8) {
      setMeterError("Token should be only 8 digits");
      return false;
    } else {
      setMeterError("");
      return true;
    }
  };

  const validateMeterNum = (meterNumbers) =>
  {
    if (meterNumbers.toString().length < 6) {
        setAmountError("Meter number should be only 6 digits");
      return false;
    } else {
        setAmountError('');
      return true;
    }
  }

  const [tokens, setTokens] = useState({});

  const check = async () => {
    try {
        const error1 = validateMeter(data.meterNumber);
      const error2 = validateMeterNum(data.meter);
        

      if (!error1 || !error2) {
        return;
      }

      setTokens({});
      const res = await axiosInstance.get("/tokens/validate/token/" + data.meterNumber+"/"+data.meter);
        setTokens(res.data);
        
        if (res.data.tokenStatus == 'USED') {
            alert("Token was already used")
        }

      if (!res.data) {
        alert(
          "Invalid Token"
        );
      }
      console.log(res.data);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      const field = error?.response?.data?.field || null;

      alert(msg);
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.mainContainer} enabled>
        <View style={styles.container}>
          <TopNav  active={'validate'} navigation={navigation} />

          <View style={{ padding: 20 }}>
            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                Validate Token
              </Text>
            </View>
            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontSize: 16 }}>
                Enter your token bellow to validate it.
              </Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 17, marginBottom: 6 }}>
                Meter number
              </Text>
              <TextInput
                value={data.meter}
                onChangeText={(val) => {
                  if (!val) {
                    setData({ ...data, meter: '' });
                    validateMeterNum(val);
                  }
                  if (containsOnlyNumbers(val)) {
                    setData({ ...data, meter: val });
                    validateMeterNum(val);
                  }
                }}
                maxLength={6}
                style={styles.inputStyle}
                placeholder="Enter meter number"
                keyboardType="numeric"
              />
              {
                amountError ?
                <Text style={{fontSize: 16,color: colors.error}}>
                {amountError}
              </Text>
                  :
                  <></>
              }
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 17, marginBottom: 6 }}>
                Token number
              </Text>
              <TextInput
                value={data.meterNumber}
                onChangeText={(val) => {
                  if (!val) {
                    setData({ ...data, meterNumber: "" });
                    validateMeter(val);
                  }
                  if (containsOnlyNumbers(val)) {
                    setData({ ...data, meterNumber: val });
                    validateMeter(val);
                  }
                }}
                maxLength={8}
                style={styles.inputStyle}
                placeholder="Enter token"
                keyboardType="numeric"
              />
              {meterError ? (
                <Text style={{ fontSize: 16, color: colors.error }}>
                  {meterError}
                </Text>
              ) : (
                <></>
              )}
            </View>

            <View style={{ marginBottom: 20 }}>
              <MainButton
                onPress={() => {
                  check();
                }}
                loading={loading}
                title={"Validate Token"}
              />
            </View>

                      {
                          tokens?.token ?
                          <View>
                                  <View><Text style={{fontSize: 20,textAlign: "center"}}>Token: {tokens?.token}</Text></View>
                                  <View><Text style={{ fontSize: 20, textAlign: "center" }}>Meter number: {tokens?.meterNumber}</Text></View>
                                  <View><Text style={{fontSize: 20,textAlign: "center"}}>Amount: {tokens?.amount?.toLocaleString() + " RWF"}</Text></View>
                                   
                                  <View><Text style={{ fontSize: 20, textAlign: "center" }}>Lighting Days: {tokens?.tokenValueDays} days</Text></View>
                          <View><Text style={{fontSize: 20,textAlign: "center"}}>Token status: {tokens?.tokenStatus != 'NEW'? tokens?.tokenStatus : "USED" }</Text></View>
                          <View><Text style={{fontSize: 20,textAlign: "center"}}>Date: {new Date(tokens?.createdAt).toLocaleDateString() + " - "+new Date(tokens?.createdAt).toLocaleTimeString()}</Text></View>

                      </View>
                              :
                              <></>
                      }

          </View>
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
    marginBottom: 10,
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

export default ValidateToken;
