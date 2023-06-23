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

function CheckPage({ navigation }) {
  function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  const [data, setData] = useState({
    amount: "",
    meterNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const [amountError, setAmountError] = useState("");
  const [meterError, setMeterError] = useState("");

  const validateMeter = (meterNumbers) => {
    if (meterNumbers.toString().length < 6) {
      setMeterError("Meter number should be only 6 digits");
      return false;
    } else {
      setMeterError("");
      return true;
    }
  };

  const [tokens, setTokens] = useState([]);

  const check = async () => {
    try {
      const error1 = validateMeter(data.meterNumber);

      if (!error1) {
        return;
      }

      setTokens([]);
      const res = await axiosInstance.get("/tokens/" + data.meterNumber);
      setTokens(res.data);
      if (res.data.length == 0) {
        alert(
          "No generated tokens found for this meter number " + data.meterNumber
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
          <TopNav  active={'check'} navigation={navigation} />

          <View style={{ padding: 20 }}>
            <View style={{ marginBottom: 25 }}>
              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                List Tokens
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
                    setData({ ...data, meterNumber: "" });
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
                title={"Get Tokens"}
              />
            </View>

            {data.meterNumber && tokens?.length > 0 ? (
              <>
                <View style={{ marginBottom: 25 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                    Generated Tokens for ({data.meterNumber})
                  </Text>
                </View>

                <View>
                  <ScrollView horizontal>
                    <View>
                      {tokens?.map((data) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              padding: 10,
                              columnGap: 20,
                              borderBottomWidth: 1,
                              borderBottomColor: colors.borderBottomColor,
                            }}
                          >
                            <View>
                              <Text style={{ fontSize: 18 }} selectable>
                                Token: {data.token}
                              </Text>
                            </View>
                            <View style={{width: 100}}>
                              <Text style={{ fontSize: 18 }}>
                                {data.amount?.toLocaleString() + " RWF"}
                              </Text>
                            </View>
                            <View style={{width: 100}}>
                              <Text style={{ fontSize: 18 }}>
                                {data?.tokenValueDays + " days"}
                              </Text>
                            </View>
                            <View>
                              <View
                                style={{
                                  backgroundColor:
                                    data?.tokenStatus == "EXPIRED" || data?.tokenStatus == 'USED'
                                      ? "#f4a1a1"
                                      : "#0ED27D",
                                  padding: 6,
                                  paddingLeft: 30,
                                  paddingRight: 30,
                                  paddingBottom: 9,
                                  textAlign: "center",
                                  borderRadius: 20,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color:
                                      data?.tokenStatus == "EXPIRED" || data?.tokenStatus == 'USED'
                                        ? "black"
                                        : "white",
                                    textAlign: "center",
                                  }}
                                >
                                  {data?.tokenStatus.toLowerCase()}
                                </Text>
                              </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  whiteSpaceWrap: "nowrap",
                                }}
                              >
                                {new Date(data?.createdAt).toLocaleDateString()}{" "}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 18,
                                  whiteSpaceWrap: "nowrap",
                                }}
                              >
                                {new Date(data?.createdAt).toLocaleTimeString()}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </>
            ) : (
              <></>
            )}
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

export default CheckPage;
