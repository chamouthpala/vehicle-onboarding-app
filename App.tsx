import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import VehicleNavigator from './navigation/VehicleNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <VehicleNavigator />
    </NavigationContainer>
  );
}
