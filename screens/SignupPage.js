import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';


const SignupPage = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Login</Text>
        <Text style={styles.textthin}>Email:</Text>
        <TextInput
          style={styles.textinput}
          value={username}
          onChangeText={(value) => setUsername(value)}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

      </View>
    </View>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: '#474747',
    borderRadius: 10,
    width: 288,
    alignItems: 'center',
  },
  text: {
    margin: 10,
    color: 'white',
    fontFamily: 'LexendDeca',
    fontSize: 30,
  },
  buttontext: {
    color: 'white',
    fontFamily: 'LexendDeca-SemiBold',
    fontSize: 15,
  },
  textthin: {
    marginVertical: 10,
    color: 'white',
    fontFamily: 'LexendDeca-SemiBold',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  textinput: {
    color: 'white',
    height: 40,
    width: 237,
    borderWidth: 1,
    padding: 10,
    borderColor: '#474747',
    borderRadius: 15,
  },
  button: {
    shadowColor: 'white', // IOS
    shadowOffset: { height: -1, width: 3 }, // IOS (negative width for left shadow)
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    borderRadius: 20,
    elevation: 5, // Android
    height: 40,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#3C1361',
  },
  error: {
    color: 'red',
    marginBottom: 5,
  },
});