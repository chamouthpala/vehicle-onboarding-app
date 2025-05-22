import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import VehiclesViewWizard from '@/components/VehicleTable';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

interface Vehicle {
  id: number;
  regnum: string;
  make: string;
  model: string;
  year: number;
  imageUrls: string[];
}

export default function ViewVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  
  return (
      <ScrollView>
        <ThemedView style={{ padding: 20 }}>
          <ThemedText type="title">View Vehicle</ThemedText>
          <VehiclesViewWizard vehicles={vehicles} />

        </ThemedView>
      </ScrollView>
    );
}


