import AddVehicleForm from '@/components/AddVehicleForm';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { ScrollView } from 'react-native';

export default function AddVehicleScreen() {
  return (
    <ScrollView>
      <ThemedView style={{ padding: 20 }}>
        <ThemedText type="title">Add New Vehicle</ThemedText>
        <AddVehicleForm />
      </ThemedView>
    </ScrollView>
  );
}
