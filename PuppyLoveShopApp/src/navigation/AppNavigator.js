import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

import WelcomeLoadingScreen from "../screens/WelcomeLoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import PromotionsScreen from "../screens/PromotionsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = { Catálogo: "🏠", Carrito: "🛒", Perfil: "👤" };

function HomeStack() {
  // Home, Servicios, Promociones, Reseñas y Categoría dibujan su propio AppHeader rosa,
  // por eso ocultamos el header nativo. ProductDetail conserva el suyo.
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: "#fff" }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Services" component={ServicesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Promotions" component={PromotionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Producto" }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: "#fff" }}>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: "Mi carrito" }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Pagar" }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Catálogo" component={HomeStack} />
      <Tab.Screen name="Carrito" component={CartStack} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const MIN_LOADING_SCREEN_MS = 1500;

export default function AppNavigator() {
  const { client, loading } = useAuth();
  const [showWelcomeLoading, setShowWelcomeLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeLoading(false), MIN_LOADING_SCREEN_MS);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showWelcomeLoading) return <WelcomeLoadingScreen />;

  return (
    <NavigationContainer>
      {client ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}