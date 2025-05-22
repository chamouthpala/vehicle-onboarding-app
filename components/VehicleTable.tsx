import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  regnum: string;
  vehicletype: string;
  fuelType: string;
  imageUrls: string[];
}

interface VehiclesViewWizardProps {
  vehicles: Vehicle[];
}

const VehiclesViewWizard: React.FC<VehiclesViewWizardProps> = ({ vehicles }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {vehicles.map((vehicle) => (
        <View key={vehicle.id} style={styles.vehicleCard}>
          <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
          <Text>Reg No: {vehicle.regnum}</Text>
          <Text>Year: {vehicle.year}</Text>
          <Text>Type: {vehicle.vehicletype}</Text>
          <Text>Fuel: {vehicle.fuelType}</Text>
          <ScrollView horizontal style={styles.imageRow}>
            {vehicle.imageUrls.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.image} />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

export default VehiclesViewWizard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  imageRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
});
