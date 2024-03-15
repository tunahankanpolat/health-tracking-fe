import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Header from './Header';
import AuthService from './services/authService';
import { useSession } from '../ctx';
import { router } from 'expo-router';
import { jwtDecode } from "jwt-decode";

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useSession();
  // Platforma özel sınıf isimlerini belirleyerek responsive tasarım sağlıyoruz
  const containerStyle = "flex-1 justify-center items-center p-4";
  const inputStyle = "border rounded w-full md:w-1/2 lg:w-1/3 p-2 mb-4";
  const buttonStyle = "bg-primary p-3 rounded w-full md:w-1/2 lg:w-1/3 items-center";
  const textStyle = "text-center text-white";
  const forgotPasswordStyle = "mt-4 text-secondary";

  const login = (username, password) => {
    let authService = new AuthService();
    authService.login(username, password)
      .then((response) => {
        signIn(response.data.token);
        //tokeni parse et, eğer role değeri adminse admin sayfasına yönlendir
        const decoded = jwtDecode(response.data.token);
        console.log(decoded.role.replace("_","-").toLowerCase());
        router.replace("/"+decoded.role.replace("_","-").toLowerCase());
      })
      .catch((error) => {
        console.log(error);
      });
  }

  
  return (
    <>
    <Header />
        <View className={`${containerStyle} bg-background`}>
      <Text className="text-xl text-text-base mb-4">Login</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        className={inputStyle}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className={inputStyle}
      />
      <Pressable className={buttonStyle} onPress = { () => login(username, password)}>
        <Text className={textStyle}>Login</Text>
      </Pressable>
      <Pressable className={forgotPasswordStyle}>
        <Text className="text-secondary">Forgot Password?</Text>
      </Pressable>
    </View>
    </>

  );
};
export default LoginScreen;
