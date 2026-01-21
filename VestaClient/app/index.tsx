import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Text, View } from 'react-native';

import LoadingScreen from './(auth)/loading';

export default function Index() {
  const { session, isLoading } = useAuth();
  
  if(isLoading) return <LoadingScreen />

  if (session?.token) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)" />;
  }
}
