import { StyleSheet, Text,TouchableOpacity,ActivityIndicator } from 'react-native';
import colors from '../../util/colors';

export default function MainButton({title,onPress,loading,fontSize}) {
  return (
    <TouchableOpacity disabled={loading==true? true: false} onPress={onPress} style={[styles.btnStyle,fontSize&& {paddingTop: 8,paddingBottom: 12,borderRadius: 16}]}>
      {
        loading == true ?
      <ActivityIndicator color={"white"} size={25} />
        :
        <></>
      }
      <Text style={[styles.btnText,fontSize && {fontSize: fontSize}]}>{title}</Text></TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: colors.primary,
    padding: 18,
    paddingBottom: 20,
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center"
  }
});
